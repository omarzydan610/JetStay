package com.example.backend.service.HotelService;

import com.example.backend.dto.HotelDTO.HotelDataResponse;
import com.example.backend.dto.HotelDTO.HotelUpdateDataRequest;
import com.example.backend.entity.Hotel;
import com.example.backend.entity.User;
import com.example.backend.exception.BadRequestException;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.HotelRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.AuthService.JwtAuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class HotelDataServiceTest {

  @Mock
  private JwtAuthService jwtAuthService;

  @Mock
  private UserRepository userRepository;

  @Mock
  private HotelRepository hotelRepository;

  @InjectMocks
  private HotelDataService hotelDataService;

  private User hotelAdmin;
  private Hotel hotel;
  private String authorizationHeader;
  private String token;
  private Integer hotelID;

  @BeforeEach
  void setUp() {
    authorizationHeader = "Bearer test-token";
    token = "test-token";
    hotelID = Integer.valueOf(200); // Use same instance for comparison

    hotelAdmin = new User();
    hotelAdmin.setUserID(1);
    hotelAdmin.setEmail("admin@hotel.com");
    hotelAdmin.setRole(User.UserRole.HOTEL_ADMIN);

    hotel = new Hotel();
    hotel.setHotelID(hotelID);
    hotel.setHotelName("TestHotel");
    hotel.setCity("TestCity");
    hotel.setCountry("TestCountry");
    hotel.setLatitude(40.7128);
    hotel.setLongitude(-74.0060);
    hotel.setHotelRate(4.2f);
    hotel.setNumberOfRates(15);
    hotel.setLogoUrl("http://example.com/hotel-logo.png");
    hotel.setStatus(Hotel.Status.ACTIVE);
    hotel.setAdmin(hotelAdmin);
  }

  @Test
  void getData_Success() {
    // Arrange
    when(jwtAuthService.extractTokenFromHeader(authorizationHeader)).thenReturn(token);
    when(jwtAuthService.extractEmail(token)).thenReturn("admin@hotel.com");
    when(userRepository.findByEmail("admin@hotel.com")).thenReturn(Optional.of(hotelAdmin));
    when(hotelRepository.findByAdminUserID(1)).thenReturn(Optional.of(hotel));
    when(jwtAuthService.extractHotelID(token)).thenReturn(hotelID);

    // Act
    HotelDataResponse response = hotelDataService.getData(authorizationHeader);

    // Assert
    assertNotNull(response);
    assertEquals("TestHotel", response.getName());
    assertEquals("TestCity", response.getCity());
    assertEquals("TestCountry", response.getCountry());
    assertEquals(40.7128, response.getLatitude());
    assertEquals(-74.0060, response.getLongitude());
    assertEquals(4.2f, response.getRate());
    assertEquals(15, response.getNumberOfRates());
    assertEquals("http://example.com/hotel-logo.png", response.getLogoUrl());
    assertEquals(Hotel.Status.ACTIVE, response.getStatus());

    verify(jwtAuthService).extractTokenFromHeader(authorizationHeader);
    verify(jwtAuthService).extractEmail(token);
    verify(userRepository).findByEmail("admin@hotel.com");
    verify(hotelRepository).findByAdminUserID(1);
    verify(jwtAuthService).extractHotelID(token);
  }

  @Test
  void getData_InvalidToken_ThrowsException() {
    // Arrange
    when(jwtAuthService.extractTokenFromHeader(authorizationHeader))
        .thenThrow(new BadRequestException("Invalid Authorization header"));

    // Act & Assert
    assertThrows(BadRequestException.class, () -> hotelDataService.getData(authorizationHeader));
    verify(jwtAuthService).extractTokenFromHeader(authorizationHeader);
    verifyNoInteractions(userRepository);
  }

  @Test
  void getData_UserNotFound_ThrowsException() {
    // Arrange
    when(jwtAuthService.extractTokenFromHeader(authorizationHeader)).thenReturn(token);
    when(jwtAuthService.extractEmail(token)).thenReturn("admin@hotel.com");
    when(userRepository.findByEmail("admin@hotel.com")).thenReturn(Optional.empty());

    // Act & Assert
    BadRequestException exception = assertThrows(BadRequestException.class,
        () -> hotelDataService.getData(authorizationHeader));
    assertEquals("Admin user not found", exception.getMessage());

    verify(jwtAuthService).extractTokenFromHeader(authorizationHeader);
    verify(jwtAuthService).extractEmail(token);
    verify(userRepository).findByEmail("admin@hotel.com");
    verifyNoInteractions(hotelRepository);
  }

  @Test
  void getData_UserNotHotelAdmin_ThrowsException() {
    // Arrange
    User clientUser = new User();
    clientUser.setUserID(2);
    clientUser.setEmail("client@example.com");
    clientUser.setRole(User.UserRole.CLIENT);

    when(jwtAuthService.extractTokenFromHeader(authorizationHeader)).thenReturn(token);
    when(jwtAuthService.extractEmail(token)).thenReturn("client@example.com");
    when(userRepository.findByEmail("client@example.com")).thenReturn(Optional.of(clientUser));

    // Act & Assert
    BadRequestException exception = assertThrows(BadRequestException.class,
        () -> hotelDataService.getData(authorizationHeader));
    assertEquals("User is not a hotel admin", exception.getMessage());

    verify(jwtAuthService).extractTokenFromHeader(authorizationHeader);
    verify(jwtAuthService).extractEmail(token);
    verify(userRepository).findByEmail("client@example.com");
    verifyNoInteractions(hotelRepository);
  }

  @Test
  void getData_HotelNotFound_ThrowsException() {
    // Arrange
    when(jwtAuthService.extractTokenFromHeader(authorizationHeader)).thenReturn(token);
    when(jwtAuthService.extractEmail(token)).thenReturn("admin@hotel.com");
    when(userRepository.findByEmail("admin@hotel.com")).thenReturn(Optional.of(hotelAdmin));
    when(hotelRepository.findByAdminUserID(1)).thenReturn(Optional.empty());

    // Act & Assert
    ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class,
        () -> hotelDataService.getData(authorizationHeader));
    assertEquals("Hotel not found", exception.getMessage());

    verify(jwtAuthService).extractTokenFromHeader(authorizationHeader);
    verify(jwtAuthService).extractEmail(token);
    verify(userRepository).findByEmail("admin@hotel.com");
    verify(hotelRepository).findByAdminUserID(1);
  }

  @Test
  void getData_TokenMismatch_ThrowsException() {
    // Arrange
    when(jwtAuthService.extractTokenFromHeader(authorizationHeader)).thenReturn(token);
    when(jwtAuthService.extractEmail(token)).thenReturn("admin@hotel.com");
    when(userRepository.findByEmail("admin@hotel.com")).thenReturn(Optional.of(hotelAdmin));
    when(hotelRepository.findByAdminUserID(1)).thenReturn(Optional.of(hotel));
    when(jwtAuthService.extractHotelID(token)).thenReturn(999); // Different ID

    // Act & Assert
    BadRequestException exception = assertThrows(BadRequestException.class,
        () -> hotelDataService.getData(authorizationHeader));
    assertEquals("Token does not match hotel admin", exception.getMessage());

    verify(jwtAuthService).extractTokenFromHeader(authorizationHeader);
    verify(jwtAuthService).extractEmail(token);
    verify(userRepository).findByEmail("admin@hotel.com");
    verify(hotelRepository).findByAdminUserID(1);
    verify(jwtAuthService).extractHotelID(token);
  }

  @Test
  void updateData_Success_UpdateAllFields() {
    // Arrange
    HotelUpdateDataRequest request = new HotelUpdateDataRequest();
    request.setName("UpdatedHotel");
    request.setCity("UpdatedCity");
    request.setCountry("UpdatedCountry");
    request.setLatitude(41.8781);
    request.setLongitude(-87.6298);
    request.setLogoUrl("http://example.com/new-logo.png");

    when(jwtAuthService.extractTokenFromHeader(authorizationHeader)).thenReturn(token);
    when(jwtAuthService.extractEmail(token)).thenReturn("admin@hotel.com");
    when(userRepository.findByEmail("admin@hotel.com")).thenReturn(Optional.of(hotelAdmin));
    when(hotelRepository.findByAdminUserID(1)).thenReturn(Optional.of(hotel));
    when(jwtAuthService.extractHotelID(token)).thenReturn(hotelID);
    when(hotelRepository.save(any(Hotel.class))).thenReturn(hotel);

    // Act
    hotelDataService.updateData(authorizationHeader, request);

    // Assert
    verify(jwtAuthService).extractTokenFromHeader(authorizationHeader);
    verify(jwtAuthService).extractEmail(token);
    verify(userRepository).findByEmail("admin@hotel.com");
    verify(hotelRepository).findByAdminUserID(1);
    verify(jwtAuthService).extractHotelID(token);
    verify(hotelRepository).save(hotel);
    assertEquals("UpdatedHotel", hotel.getHotelName());
    assertEquals("UpdatedCity", hotel.getCity());
    assertEquals("UpdatedCountry", hotel.getCountry());
    assertEquals(41.8781, hotel.getLatitude());
    assertEquals(-87.6298, hotel.getLongitude());
    assertEquals("http://example.com/new-logo.png", hotel.getLogoUrl());
  }

  @Test
  void updateData_Success_UpdatePartialFields() {
    // Arrange
    HotelUpdateDataRequest request = new HotelUpdateDataRequest();
    request.setName("UpdatedHotel");
    request.setCity("UpdatedCity");
    // Other fields are null

    when(jwtAuthService.extractTokenFromHeader(authorizationHeader)).thenReturn(token);
    when(jwtAuthService.extractEmail(token)).thenReturn("admin@hotel.com");
    when(userRepository.findByEmail("admin@hotel.com")).thenReturn(Optional.of(hotelAdmin));
    when(hotelRepository.findByAdminUserID(1)).thenReturn(Optional.of(hotel));
    when(jwtAuthService.extractHotelID(token)).thenReturn(hotelID);
    when(hotelRepository.save(any(Hotel.class))).thenReturn(hotel);

    // Act
    hotelDataService.updateData(authorizationHeader, request);

    // Assert
    verify(hotelRepository).save(hotel);
    assertEquals("UpdatedHotel", hotel.getHotelName());
    assertEquals("UpdatedCity", hotel.getCity());
    // Original values should remain
    assertEquals("TestCountry", hotel.getCountry());
    assertEquals(40.7128, hotel.getLatitude());
    assertEquals(-74.0060, hotel.getLongitude());
    assertEquals("http://example.com/hotel-logo.png", hotel.getLogoUrl());
  }

  @Test
  void updateData_EmptyRequest_ThrowsException() {
    // Arrange
    HotelUpdateDataRequest request = new HotelUpdateDataRequest();
    // All fields are null

    // Act & Assert
    BadRequestException exception = assertThrows(BadRequestException.class,
        () -> hotelDataService.updateData(authorizationHeader, request));
    assertEquals("Update request cannot be empty", exception.getMessage());

    verifyNoInteractions(jwtAuthService);
    verifyNoInteractions(userRepository);
    verifyNoInteractions(hotelRepository);
  }

  @Test
  void updateData_UserNotFound_ThrowsException() {
    // Arrange
    HotelUpdateDataRequest request = new HotelUpdateDataRequest();
    request.setName("UpdatedHotel");

    when(jwtAuthService.extractTokenFromHeader(authorizationHeader)).thenReturn(token);
    when(jwtAuthService.extractEmail(token)).thenReturn("admin@hotel.com");
    when(userRepository.findByEmail("admin@hotel.com")).thenReturn(Optional.empty());

    // Act & Assert
    BadRequestException exception = assertThrows(BadRequestException.class,
        () -> hotelDataService.updateData(authorizationHeader, request));
    assertEquals("Admin user not found", exception.getMessage());

    verify(jwtAuthService).extractTokenFromHeader(authorizationHeader);
    verify(jwtAuthService).extractEmail(token);
    verify(userRepository).findByEmail("admin@hotel.com");
    verifyNoInteractions(hotelRepository);
  }

  @Test
  void updateData_UserNotHotelAdmin_ThrowsException() {
    // Arrange
    HotelUpdateDataRequest request = new HotelUpdateDataRequest();
    request.setName("UpdatedHotel");

    User clientUser = new User();
    clientUser.setUserID(2);
    clientUser.setEmail("client@example.com");
    clientUser.setRole(User.UserRole.CLIENT);

    when(jwtAuthService.extractTokenFromHeader(authorizationHeader)).thenReturn(token);
    when(jwtAuthService.extractEmail(token)).thenReturn("client@example.com");
    when(userRepository.findByEmail("client@example.com")).thenReturn(Optional.of(clientUser));

    // Act & Assert
    BadRequestException exception = assertThrows(BadRequestException.class,
        () -> hotelDataService.updateData(authorizationHeader, request));
    assertEquals("User is not a hotel admin", exception.getMessage());

    verify(jwtAuthService).extractTokenFromHeader(authorizationHeader);
    verify(jwtAuthService).extractEmail(token);
    verify(userRepository).findByEmail("client@example.com");
    verifyNoInteractions(hotelRepository);
  }

  @Test
  void updateData_HotelNotFound_ThrowsException() {
    // Arrange
    HotelUpdateDataRequest request = new HotelUpdateDataRequest();
    request.setName("UpdatedHotel");

    when(jwtAuthService.extractTokenFromHeader(authorizationHeader)).thenReturn(token);
    when(jwtAuthService.extractEmail(token)).thenReturn("admin@hotel.com");
    when(userRepository.findByEmail("admin@hotel.com")).thenReturn(Optional.of(hotelAdmin));
    when(hotelRepository.findByAdminUserID(1)).thenReturn(Optional.empty());

    // Act & Assert
    ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class,
        () -> hotelDataService.updateData(authorizationHeader, request));
    assertEquals("Hotel not found", exception.getMessage());

    verify(jwtAuthService).extractTokenFromHeader(authorizationHeader);
    verify(jwtAuthService).extractEmail(token);
    verify(userRepository).findByEmail("admin@hotel.com");
    verify(hotelRepository).findByAdminUserID(1);
  }

  @Test
  void updateData_TokenMismatch_ThrowsException() {
    // Arrange
    HotelUpdateDataRequest request = new HotelUpdateDataRequest();
    request.setName("UpdatedHotel");

    when(jwtAuthService.extractTokenFromHeader(authorizationHeader)).thenReturn(token);
    when(jwtAuthService.extractEmail(token)).thenReturn("admin@hotel.com");
    when(userRepository.findByEmail("admin@hotel.com")).thenReturn(Optional.of(hotelAdmin));
    when(hotelRepository.findByAdminUserID(1)).thenReturn(Optional.of(hotel));
    when(jwtAuthService.extractHotelID(token)).thenReturn(999); // Different ID

    // Act & Assert
    BadRequestException exception = assertThrows(BadRequestException.class,
        () -> hotelDataService.updateData(authorizationHeader, request));
    assertEquals("Token does not match hotel admin", exception.getMessage());

    verify(jwtAuthService).extractTokenFromHeader(authorizationHeader);
    verify(jwtAuthService).extractEmail(token);
    verify(userRepository).findByEmail("admin@hotel.com");
    verify(hotelRepository).findByAdminUserID(1);
    verify(jwtAuthService).extractHotelID(token);
    verify(hotelRepository, never()).save(any());
  }

  @Test
  void updateData_SaveFails_ThrowsException() {
    // Arrange
    HotelUpdateDataRequest request = new HotelUpdateDataRequest();
    request.setName("UpdatedHotel");

    when(jwtAuthService.extractTokenFromHeader(authorizationHeader)).thenReturn(token);
    when(jwtAuthService.extractEmail(token)).thenReturn("admin@hotel.com");
    when(userRepository.findByEmail("admin@hotel.com")).thenReturn(Optional.of(hotelAdmin));
    when(hotelRepository.findByAdminUserID(1)).thenReturn(Optional.of(hotel));
    when(jwtAuthService.extractHotelID(token)).thenReturn(hotelID);
    when(hotelRepository.save(any(Hotel.class))).thenThrow(new RuntimeException("Database error"));

    // Act & Assert
    BadRequestException exception = assertThrows(BadRequestException.class,
        () -> hotelDataService.updateData(authorizationHeader, request));
    assertTrue(exception.getMessage().contains("Failed to update hotel data"));

    verify(hotelRepository).save(hotel);
  }
}

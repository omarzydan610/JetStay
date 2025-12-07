package com.example.backend.service.AirlineService;

import com.example.backend.dto.AirlineDTO.AirlineDataResponse;
import com.example.backend.dto.AirlineDTO.AirlineUpdateDataRequest;
import com.example.backend.dto.AirlineDTO.CityDtoResponse;
import com.example.backend.dto.AirlineDTO.CountryDtoResponse;
import com.example.backend.entity.Airline;
import com.example.backend.entity.Airport;
import com.example.backend.entity.User;
import com.example.backend.exception.BadRequestException;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.AirlineRepository;
import com.example.backend.repository.AirportRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.AuthService.JwtAuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AirlineDataServiceTest {

  @Mock
  private JwtAuthService jwtAuthService;

  @Mock
  private UserRepository userRepository;

  @Mock
  private AirlineRepository airlineRepository;

  @InjectMocks
  private AirlineDataService airlineDataService;

  @Mock private AirportRepository airportRepository;



  private User airlineAdmin;
  private Airline airline;
  private String authorizationHeader;
  private String token;

  @BeforeEach
  void setUp() {
    authorizationHeader = "Bearer test-token";
    token = "test-token";

    airlineAdmin = new User();
    airlineAdmin.setUserID(1);
    airlineAdmin.setEmail("admin@airline.com");
    airlineAdmin.setRole(User.UserRole.AIRLINE_ADMIN);

    airline = new Airline();
    airline.setAirlineID(100);
    airline.setAirlineName("TestAirline");
    airline.setAirlineNationality("TestCountry");
    airline.setAirlineRate(4.5f);
    airline.setNumberOfRates(10);
    airline.setLogoUrl("http://example.com/logo.png");
    airline.setStatus(Airline.Status.ACTIVE);
    airline.setAdmin(airlineAdmin);
  }

  @Test
  void getData_Success() {
    // Arrange
    when(jwtAuthService.extractTokenFromHeader(authorizationHeader)).thenReturn(token);
    when(jwtAuthService.extractEmail(token)).thenReturn("admin@airline.com");
    when(userRepository.findByEmail("admin@airline.com")).thenReturn(Optional.of(airlineAdmin));
    when(airlineRepository.findByAdminUserID(1)).thenReturn(Optional.of(airline));
    when(jwtAuthService.extractAirlineID(token)).thenReturn(100);

    // Act
    AirlineDataResponse response = airlineDataService.getData(authorizationHeader);

    // Assert
    assertNotNull(response);
    assertEquals("TestAirline", response.getName());
    assertEquals("TestCountry", response.getNationality());
    assertEquals(4.5f, response.getRate());
    assertEquals(10, response.getNumberOfRates());
    assertEquals("http://example.com/logo.png", response.getLogoUrl());
    assertEquals(Airline.Status.ACTIVE, response.getStatus());

    verify(jwtAuthService).extractTokenFromHeader(authorizationHeader);
    verify(jwtAuthService).extractEmail(token);
    verify(userRepository).findByEmail("admin@airline.com");
    verify(airlineRepository).findByAdminUserID(1);
    verify(jwtAuthService).extractAirlineID(token);
  }

  @Test
  void getData_InvalidToken_ThrowsException() {
    // Arrange
    when(jwtAuthService.extractTokenFromHeader(authorizationHeader))
        .thenThrow(new BadRequestException("Invalid Authorization header"));

    // Act & Assert
    assertThrows(BadRequestException.class, () -> airlineDataService.getData(authorizationHeader));
    verify(jwtAuthService).extractTokenFromHeader(authorizationHeader);
    verifyNoInteractions(userRepository);
  }

  @Test
  void getData_UserNotFound_ThrowsException() {
    // Arrange
    when(jwtAuthService.extractTokenFromHeader(authorizationHeader)).thenReturn(token);
    when(jwtAuthService.extractEmail(token)).thenReturn("admin@airline.com");
    when(userRepository.findByEmail("admin@airline.com")).thenReturn(Optional.empty());

    // Act & Assert
    BadRequestException exception = assertThrows(BadRequestException.class,
        () -> airlineDataService.getData(authorizationHeader));
    assertEquals("Admin user not found", exception.getMessage());

    verify(jwtAuthService).extractTokenFromHeader(authorizationHeader);
    verify(jwtAuthService).extractEmail(token);
    verify(userRepository).findByEmail("admin@airline.com");
    verifyNoInteractions(airlineRepository);
  }

  @Test
  void getData_UserNotAirlineAdmin_ThrowsException() {
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
        () -> airlineDataService.getData(authorizationHeader));
    assertEquals("User is not an airline admin", exception.getMessage());

    verify(jwtAuthService).extractTokenFromHeader(authorizationHeader);
    verify(jwtAuthService).extractEmail(token);
    verify(userRepository).findByEmail("client@example.com");
    verifyNoInteractions(airlineRepository);
  }

  @Test
  void getData_AirlineNotFound_ThrowsException() {
    // Arrange
    when(jwtAuthService.extractTokenFromHeader(authorizationHeader)).thenReturn(token);
    when(jwtAuthService.extractEmail(token)).thenReturn("admin@airline.com");
    when(userRepository.findByEmail("admin@airline.com")).thenReturn(Optional.of(airlineAdmin));
    when(airlineRepository.findByAdminUserID(1)).thenReturn(Optional.empty());

    // Act & Assert
    ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class,
        () -> airlineDataService.getData(authorizationHeader));
    assertEquals("Airline not found", exception.getMessage());

    verify(jwtAuthService).extractTokenFromHeader(authorizationHeader);
    verify(jwtAuthService).extractEmail(token);
    verify(userRepository).findByEmail("admin@airline.com");
    verify(airlineRepository).findByAdminUserID(1);
  }

  @Test
  void getData_TokenMismatch_ThrowsException() {
    // Arrange
    when(jwtAuthService.extractTokenFromHeader(authorizationHeader)).thenReturn(token);
    when(jwtAuthService.extractEmail(token)).thenReturn("admin@airline.com");
    when(userRepository.findByEmail("admin@airline.com")).thenReturn(Optional.of(airlineAdmin));
    when(airlineRepository.findByAdminUserID(1)).thenReturn(Optional.of(airline));
    when(jwtAuthService.extractAirlineID(token)).thenReturn(999); // Different ID

    // Act & Assert
    BadRequestException exception = assertThrows(BadRequestException.class,
        () -> airlineDataService.getData(authorizationHeader));
    assertEquals("Token does not match airline admin", exception.getMessage());

    verify(jwtAuthService).extractTokenFromHeader(authorizationHeader);
    verify(jwtAuthService).extractEmail(token);
    verify(userRepository).findByEmail("admin@airline.com");
    verify(airlineRepository).findByAdminUserID(1);
    verify(jwtAuthService).extractAirlineID(token);
  }

  @Test
  void updateData_Success_UpdateAllFields() {
    // Arrange
    AirlineUpdateDataRequest request = new AirlineUpdateDataRequest();
    request.setName("UpdatedAirline");
    request.setNationality("UpdatedCountry");
    request.setLogoUrl("http://example.com/new-logo.png");

    when(jwtAuthService.extractTokenFromHeader(authorizationHeader)).thenReturn(token);
    when(jwtAuthService.extractEmail(token)).thenReturn("admin@airline.com");
    when(userRepository.findByEmail("admin@airline.com")).thenReturn(Optional.of(airlineAdmin));
    when(airlineRepository.findByAdminUserID(1)).thenReturn(Optional.of(airline));
    when(jwtAuthService.extractAirlineID(token)).thenReturn(100);
    when(airlineRepository.save(any(Airline.class))).thenReturn(airline);

    // Act
    airlineDataService.updateData(authorizationHeader, request);

    // Assert
    verify(jwtAuthService).extractTokenFromHeader(authorizationHeader);
    verify(jwtAuthService).extractEmail(token);
    verify(userRepository).findByEmail("admin@airline.com");
    verify(airlineRepository).findByAdminUserID(1);
    verify(jwtAuthService).extractAirlineID(token);
    verify(airlineRepository).save(airline);
    assertEquals("UpdatedAirline", airline.getAirlineName());
    assertEquals("UpdatedCountry", airline.getAirlineNationality());
    assertEquals("http://example.com/new-logo.png", airline.getLogoUrl());
  }

  @Test
  void updateData_Success_UpdatePartialFields() {
    // Arrange
    AirlineUpdateDataRequest request = new AirlineUpdateDataRequest();
    request.setName("UpdatedAirline");
    // nationality and logoUrl are null

    when(jwtAuthService.extractTokenFromHeader(authorizationHeader)).thenReturn(token);
    when(jwtAuthService.extractEmail(token)).thenReturn("admin@airline.com");
    when(userRepository.findByEmail("admin@airline.com")).thenReturn(Optional.of(airlineAdmin));
    when(airlineRepository.findByAdminUserID(1)).thenReturn(Optional.of(airline));
    when(jwtAuthService.extractAirlineID(token)).thenReturn(100);
    when(airlineRepository.save(any(Airline.class))).thenReturn(airline);

    // Act
    airlineDataService.updateData(authorizationHeader, request);

    // Assert
    verify(airlineRepository).save(airline);
    assertEquals("UpdatedAirline", airline.getAirlineName());
    // Original values should remain
    assertEquals("TestCountry", airline.getAirlineNationality());
    assertEquals("http://example.com/logo.png", airline.getLogoUrl());
  }

  @Test
  void updateData_EmptyRequest_ThrowsException() {
    // Arrange
    AirlineUpdateDataRequest request = new AirlineUpdateDataRequest();
    // All fields are null

    // Act & Assert
    BadRequestException exception = assertThrows(BadRequestException.class,
        () -> airlineDataService.updateData(authorizationHeader, request));
    assertEquals("Update request cannot be empty", exception.getMessage());

    verifyNoInteractions(jwtAuthService);
    verifyNoInteractions(userRepository);
    verifyNoInteractions(airlineRepository);
  }

  @Test
  void updateData_UserNotFound_ThrowsException() {
    // Arrange
    AirlineUpdateDataRequest request = new AirlineUpdateDataRequest();
    request.setName("UpdatedAirline");

    when(jwtAuthService.extractTokenFromHeader(authorizationHeader)).thenReturn(token);
    when(jwtAuthService.extractEmail(token)).thenReturn("admin@airline.com");
    when(userRepository.findByEmail("admin@airline.com")).thenReturn(Optional.empty());

    // Act & Assert
    BadRequestException exception = assertThrows(BadRequestException.class,
        () -> airlineDataService.updateData(authorizationHeader, request));
    assertEquals("Admin user not found", exception.getMessage());

    verify(jwtAuthService).extractTokenFromHeader(authorizationHeader);
    verify(jwtAuthService).extractEmail(token);
    verify(userRepository).findByEmail("admin@airline.com");
    verifyNoInteractions(airlineRepository);
  }

  @Test
  void updateData_UserNotAirlineAdmin_ThrowsException() {
    // Arrange
    AirlineUpdateDataRequest request = new AirlineUpdateDataRequest();
    request.setName("UpdatedAirline");

    User clientUser = new User();
    clientUser.setUserID(2);
    clientUser.setEmail("client@example.com");
    clientUser.setRole(User.UserRole.CLIENT);

    when(jwtAuthService.extractTokenFromHeader(authorizationHeader)).thenReturn(token);
    when(jwtAuthService.extractEmail(token)).thenReturn("client@example.com");
    when(userRepository.findByEmail("client@example.com")).thenReturn(Optional.of(clientUser));

    // Act & Assert
    BadRequestException exception = assertThrows(BadRequestException.class,
        () -> airlineDataService.updateData(authorizationHeader, request));
    assertEquals("User is not an airline admin", exception.getMessage());

    verify(jwtAuthService).extractTokenFromHeader(authorizationHeader);
    verify(jwtAuthService).extractEmail(token);
    verify(userRepository).findByEmail("client@example.com");
    verifyNoInteractions(airlineRepository);
  }

  @Test
  void updateData_AirlineNotFound_ThrowsException() {
    // Arrange
    AirlineUpdateDataRequest request = new AirlineUpdateDataRequest();
    request.setName("UpdatedAirline");

    when(jwtAuthService.extractTokenFromHeader(authorizationHeader)).thenReturn(token);
    when(jwtAuthService.extractEmail(token)).thenReturn("admin@airline.com");
    when(userRepository.findByEmail("admin@airline.com")).thenReturn(Optional.of(airlineAdmin));
    when(airlineRepository.findByAdminUserID(1)).thenReturn(Optional.empty());

    // Act & Assert
    ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class,
        () -> airlineDataService.updateData(authorizationHeader, request));
    assertEquals("Airline not found", exception.getMessage());

    verify(jwtAuthService).extractTokenFromHeader(authorizationHeader);
    verify(jwtAuthService).extractEmail(token);
    verify(userRepository).findByEmail("admin@airline.com");
    verify(airlineRepository).findByAdminUserID(1);
  }

  @Test
  void updateData_TokenMismatch_ThrowsException() {
    // Arrange
    AirlineUpdateDataRequest request = new AirlineUpdateDataRequest();
    request.setName("UpdatedAirline");

    when(jwtAuthService.extractTokenFromHeader(authorizationHeader)).thenReturn(token);
    when(jwtAuthService.extractEmail(token)).thenReturn("admin@airline.com");
    when(userRepository.findByEmail("admin@airline.com")).thenReturn(Optional.of(airlineAdmin));
    when(airlineRepository.findByAdminUserID(1)).thenReturn(Optional.of(airline));
    when(jwtAuthService.extractAirlineID(token)).thenReturn(999); // Different ID

    // Act & Assert
    BadRequestException exception = assertThrows(BadRequestException.class,
        () -> airlineDataService.updateData(authorizationHeader, request));
    assertEquals("Token does not match airline admin", exception.getMessage());

    verify(jwtAuthService).extractTokenFromHeader(authorizationHeader);
    verify(jwtAuthService).extractEmail(token);
    verify(userRepository).findByEmail("admin@airline.com");
    verify(airlineRepository).findByAdminUserID(1);
    verify(jwtAuthService).extractAirlineID(token);
    verify(airlineRepository, never()).save(any());
  }

  @Test
  void updateData_SaveFails_ThrowsException() {
    // Arrange
    AirlineUpdateDataRequest request = new AirlineUpdateDataRequest();
    request.setName("UpdatedAirline");

    when(jwtAuthService.extractTokenFromHeader(authorizationHeader)).thenReturn(token);
    when(jwtAuthService.extractEmail(token)).thenReturn("admin@airline.com");
    when(userRepository.findByEmail("admin@airline.com")).thenReturn(Optional.of(airlineAdmin));
    when(airlineRepository.findByAdminUserID(1)).thenReturn(Optional.of(airline));
    when(jwtAuthService.extractAirlineID(token)).thenReturn(100);
    when(airlineRepository.save(any(Airline.class))).thenThrow(new RuntimeException("Database error"));

    // Act & Assert
    BadRequestException exception = assertThrows(BadRequestException.class,
        () -> airlineDataService.updateData(authorizationHeader, request));
    assertTrue(exception.getMessage().contains("Failed to update airline data"));

    verify(airlineRepository).save(airline);
  }

  @Test
  void getAllAirPorts_ReturnsList() {
    Airport airport = new Airport();
    airport.setAirportID(1);
    airport.setAirportName("Test Airport");
    airport.setCountry("Egypt");
    airport.setCity("Cairo");

    when(airportRepository.findByCountryAndCity("Egypt", "Cairo"))
        .thenReturn(List.of(airport));

    List<Airport> result = airlineDataService.getAllAirPorts("Egypt", "Cairo");

    assertNotNull(result);
    assertEquals(1, result.size());
    assertEquals("Cairo", result.get(0).getCity());
    verify(airportRepository).findByCountryAndCity("Egypt", "Cairo");
  }

  @Test
  void getAllAirPorts_ReturnsEmptyList() {
    when(airportRepository.findByCountryAndCity("USA", "Miami"))
        .thenReturn(List.of());

    List<Airport> result = airlineDataService.getAllAirPorts("USA", "Miami");

    assertNotNull(result);
    assertTrue(result.isEmpty());
    verify(airportRepository).findByCountryAndCity("USA", "Miami");
  }

  @Test
  void getAllCountries_ReturnsList() {
    List<CountryDtoResponse> countries = List.of(
        new CountryDtoResponse("Egypt"),
        new CountryDtoResponse("UAE"));

    when(airportRepository.findAllCountries()).thenReturn(countries);

    List<CountryDtoResponse> result = airlineDataService.getAllCountries();

    assertEquals(2, result.size());
    assertEquals("Egypt", result.get(0).getName());
    verify(airportRepository).findAllCountries();
  }

  @Test
  void getAllCountries_ReturnsEmptyList() {
    when(airportRepository.findAllCountries()).thenReturn(List.of());

    List<CountryDtoResponse> result = airlineDataService.getAllCountries();

    assertTrue(result.isEmpty());
    verify(airportRepository).findAllCountries();
  }

  @Test
  void getCitiesByCountry_ReturnsList() {
    List<CityDtoResponse> cities = List.of(
        new CityDtoResponse("Cairo"),
        new CityDtoResponse("Giza"));

    when(airportRepository.findAllCitiesByCountry("Egypt")).thenReturn(cities);

    List<CityDtoResponse> result = airlineDataService.getCitiesByCountry("Egypt");

    assertEquals(2, result.size());
    assertEquals("Cairo", result.get(0).getName());
    verify(airportRepository).findAllCitiesByCountry("Egypt");
  }

  @Test
  void getCitiesByCountry_ReturnsEmptyList() {
    when(airportRepository.findAllCitiesByCountry("USA"))
        .thenReturn(List.of());

    List<CityDtoResponse> result = airlineDataService.getCitiesByCountry("USA");

    assertTrue(result.isEmpty());
    verify(airportRepository).findAllCitiesByCountry("USA");
  }
}

package com.example.backend.service.Partnership;

import com.example.backend.dto.AuthDTO.UserDTO;
import com.example.backend.dto.PartnershipRequist.HotelPartnershipRequest;
import com.example.backend.entity.Hotel;
import com.example.backend.entity.User;
import com.example.backend.exception.BadRequestException;
import com.example.backend.exception.InternalServerErrorException;
import com.example.backend.mapper.HotelCreatorMapper;
import com.example.backend.repository.HotelRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.AuthService.AuthService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;

import java.io.IOException;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class HotelPartnershipServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private HotelRepository hotelRepository;

    @Mock
    private FileStorageService fileStorageService;

    @Mock
    private AuthService authService;

    @Mock
    private HotelCreatorMapper hotelMapper;

    @InjectMocks
    private PartnershipService partnershipService;

    @Test
    public void testSubmitHotelPartnership_Success() throws IOException {
        // Given
        HotelPartnershipRequest request = new HotelPartnershipRequest();
        request.setHotelName("TestHotel");
        request.setLatitude(10.0);
        request.setLongitude(20.0);
        request.setCity("CityX");
        request.setCountry("CountryY");
        request.setAdminFirstName("Alice");
        request.setAdminLastName("Smith");
        request.setAdminPhone("0987654321");
        request.setManagerEmail("manager@hotel.com");
        request.setManagerPassword("pwd");
        MockMultipartFile logo = new MockMultipartFile("hotelLogo", "logo.png", "image/png", "data".getBytes());
        request.setHotelLogo(logo);

        when(userRepository.existsByEmail(request.getManagerEmail())).thenReturn(false);

        // Mock AuthService signup success
        doNothing().when(authService).SignUp(any(UserDTO.class), eq(User.UserRole.HOTEL_ADMIN));

        User savedUser = new User();
        savedUser.setUserID(11);
        savedUser.setEmail(request.getManagerEmail());
        when(userRepository.findByEmail(request.getManagerEmail())).thenReturn(java.util.Optional.of(savedUser));

        Hotel savedHotel = new Hotel();
        savedHotel.setHotelID(21);
        when(hotelRepository.save(any(Hotel.class))).thenReturn(savedHotel);

        when(fileStorageService.storeFile(any())).thenReturn("http://example.com/hotel.png");

        Hotel hotel = new Hotel();
        hotel.setHotelName(request.getHotelName());
        hotel.setLatitude(request.getLatitude());
        hotel.setLongitude(request.getLongitude());
        hotel.setCity(request.getCity());
        hotel.setCountry(request.getCountry());
        hotel.setAdmin(savedUser);
        hotel.setLogoUrl("http://example.com/hotel.png");
        when(hotelMapper.createHotel(any(), any(), any(), any(), any(), any(), any())).thenReturn(hotel);

        partnershipService.submitHotelPartnership(request);

        verify(userRepository).existsByEmail(request.getManagerEmail());
        verify(authService).SignUp(any(UserDTO.class), eq(User.UserRole.HOTEL_ADMIN));
        verify(userRepository).findByEmail(request.getManagerEmail());
        verify(hotelRepository).save(any(Hotel.class));
        verify(fileStorageService).storeFile(any());
    }

    @Test
    public void testSubmitHotelPartnership_ManagerEmailExists_Throws() {
        // Given
        HotelPartnershipRequest request = new HotelPartnershipRequest();
        request.setManagerEmail("exists@hotel.com");
        request.setHotelName("TestHotel");

        when(userRepository.existsByEmail(request.getManagerEmail())).thenReturn(true);

        // When & Then
        BadRequestException ex = assertThrows(BadRequestException.class,
                () -> partnershipService.submitHotelPartnership(request));

        assertTrue(ex.getMessage().contains(request.getManagerEmail()));

        verify(userRepository).existsByEmail(request.getManagerEmail());
        verifyNoInteractions(authService);
        verify(hotelRepository, never()).save(any());
    }

    @Test
    public void testSubmitHotelPartnership_AuthServiceFails_Throws() throws IOException {
        // Given
        HotelPartnershipRequest request = new HotelPartnershipRequest();
        request.setHotelName("TestHotel");
        request.setManagerEmail("manager@hotel.com");
        request.setManagerPassword("pwd");

        when(userRepository.existsByEmail(request.getManagerEmail())).thenReturn(false);

        // Mock AuthService signup failure
        doThrow(new BadRequestException("Failed to create admin user")).when(authService)
                .SignUp(any(UserDTO.class), eq(User.UserRole.HOTEL_ADMIN));

        // When & Then
        BadRequestException ex = assertThrows(BadRequestException.class,
                () -> partnershipService.submitHotelPartnership(request));

        assertTrue(ex.getMessage().contains("Failed to create admin user"));

        verify(authService).SignUp(any(UserDTO.class), eq(User.UserRole.HOTEL_ADMIN));
        verify(userRepository, never()).findByEmail(anyString());
        verify(hotelRepository, never()).save(any());
    }

    @Test
    public void testSubmitHotelPartnership_UserNotFoundAfterSignup_Throws() throws IOException {
        // Given
        HotelPartnershipRequest request = new HotelPartnershipRequest();
        request.setHotelName("TestHotel");
        request.setManagerEmail("manager@hotel.com");
        request.setManagerPassword("pwd");

        when(userRepository.existsByEmail(request.getManagerEmail())).thenReturn(false);

        // Mock AuthService signup success but user not found in repository
        doNothing().when(authService).SignUp(any(UserDTO.class), eq(User.UserRole.HOTEL_ADMIN));
        when(userRepository.findByEmail(request.getManagerEmail())).thenReturn(java.util.Optional.empty());

        // When & Then
        InternalServerErrorException ex = assertThrows(InternalServerErrorException.class,
                () -> partnershipService.submitHotelPartnership(request));

        assertTrue(ex.getMessage().contains("Failed to retrieve saved admin user"));

        verify(authService).SignUp(any(UserDTO.class), eq(User.UserRole.HOTEL_ADMIN));
        verify(userRepository).findByEmail(request.getManagerEmail());
        verify(hotelRepository, never()).save(any());
    }

    @Test
    public void testSubmitHotelPartnership_NoLogo_Success() throws IOException {
        // Given
        HotelPartnershipRequest request = new HotelPartnershipRequest();
        request.setHotelName("NoLogoHotel");
        request.setManagerEmail("nologo@hotel.com");
        request.setManagerPassword("pwd");

        when(userRepository.existsByEmail(request.getManagerEmail())).thenReturn(false);

        doNothing().when(authService).SignUp(any(UserDTO.class), eq(User.UserRole.HOTEL_ADMIN));

        User savedUser = new User();
        savedUser.setUserID(60);
        savedUser.setEmail(request.getManagerEmail());
        when(userRepository.findByEmail(request.getManagerEmail())).thenReturn(java.util.Optional.of(savedUser));

        Hotel savedHotel = new Hotel();
        savedHotel.setHotelID(61);
        when(hotelRepository.save(any(Hotel.class))).thenReturn(savedHotel);

        request.setHotelLogo(null);

        Hotel hotel = new Hotel();
        hotel.setHotelName(request.getHotelName());
        hotel.setAdmin(savedUser);
        when(hotelMapper.createHotel(any(), any(), any(), any(), any(), any(), any())).thenReturn(hotel);

        partnershipService.submitHotelPartnership(request);

        verify(fileStorageService, never()).storeFile(any());
        verify(hotelRepository).save(any(Hotel.class));
    }

    @Test
    public void testSubmitHotelPartnership_FileStorageThrows_ThrowsIOException() throws IOException {
        // Given
        HotelPartnershipRequest request = new HotelPartnershipRequest();
        request.setHotelName("FailHotel");
        request.setManagerEmail("fail@hotel.com");
        request.setManagerPassword("pwd");
        MockMultipartFile logo = new MockMultipartFile("hotelLogo", "logo.png", "image/png", "data".getBytes());
        request.setHotelLogo(logo);

        when(userRepository.existsByEmail(request.getManagerEmail())).thenReturn(false);

        doNothing().when(authService).SignUp(any(UserDTO.class), eq(User.UserRole.HOTEL_ADMIN));

        User savedUser = new User();
        savedUser.setUserID(70);
        savedUser.setEmail(request.getManagerEmail());
        when(userRepository.findByEmail(request.getManagerEmail())).thenReturn(java.util.Optional.of(savedUser));

        when(fileStorageService.storeFile(any())).thenThrow(new IOException("upload failed"));

        // When & Then
        InternalServerErrorException ex = assertThrows(InternalServerErrorException.class,
                () -> partnershipService.submitHotelPartnership(request));

        assertTrue(ex.getMessage().contains("Failed to store hotel logo"));

        verify(hotelRepository, never()).save(any());
    }

    @Test
    public void testSubmitHotelPartnership_VerifySavedHotelFields() throws IOException {
        // Given
        HotelPartnershipRequest request = new HotelPartnershipRequest();
        request.setHotelName("CaptureHotel");
        request.setLatitude(12.34);
        request.setLongitude(56.78);
        request.setCity("CityC");
        request.setCountry("CountryC");
        request.setAdminFirstName("Adm");
        request.setAdminLastName("In");
        request.setAdminPhone("123123");
        request.setManagerEmail("capture@hotel.com");
        request.setManagerPassword("pwd");
        MockMultipartFile logo = new MockMultipartFile("hotelLogo", "logo.png", "image/png", "data".getBytes());
        request.setHotelLogo(logo);

        when(userRepository.existsByEmail(request.getManagerEmail())).thenReturn(false);

        doNothing().when(authService).SignUp(any(UserDTO.class), eq(User.UserRole.HOTEL_ADMIN));

        User savedUser = new User();
        savedUser.setUserID(80);
        savedUser.setEmail(request.getManagerEmail());
        when(userRepository.findByEmail(request.getManagerEmail())).thenReturn(java.util.Optional.of(savedUser));

        Hotel savedHotel = new Hotel();
        savedHotel.setHotelID(81);
        when(hotelRepository.save(any(Hotel.class))).thenReturn(savedHotel);

        when(fileStorageService.storeFile(any())).thenReturn("http://example.com/hcap.png");

        Hotel hotel = new Hotel();
        hotel.setHotelName(request.getHotelName());
        hotel.setLatitude(request.getLatitude());
        hotel.setLongitude(request.getLongitude());
        hotel.setCity(request.getCity());
        hotel.setCountry(request.getCountry());
        hotel.setAdmin(savedUser);
        hotel.setLogoUrl("http://example.com/hcap.png");
        hotel.setHotelRate(0.0f);
        hotel.setNumberOfRates(0);
        hotel.setStatus(Hotel.Status.INACTIVE);
        hotel.setCreatedAt(java.time.LocalDateTime.now());
        when(hotelMapper.createHotel(any(), any(), any(), any(), any(), any(), any())).thenReturn(hotel);

        partnershipService.submitHotelPartnership(request);

        org.mockito.ArgumentCaptor<Hotel> captor = org.mockito.ArgumentCaptor.forClass(Hotel.class);
        verify(hotelRepository).save(captor.capture());
        Hotel captured = captor.getValue();

        assertEquals(request.getHotelName(), captured.getHotelName());
        assertEquals(request.getLatitude(), captured.getLatitude());
        assertEquals(request.getLongitude(), captured.getLongitude());
        assertEquals(request.getCity(), captured.getCity());
        assertEquals(request.getCountry(), captured.getCountry());
        assertEquals(savedUser, captured.getAdmin());
        assertEquals(0.0f, captured.getHotelRate(), 0.001f);
        assertEquals(0, captured.getNumberOfRates());
        assertEquals(Hotel.Status.INACTIVE, captured.getStatus());
        assertEquals("http://example.com/hcap.png", captured.getLogoUrl());
        assertNotNull(captured.getCreatedAt());
    }
}
package com.example.backend.service.Partnership;

import com.example.backend.dto.AuthDTO.UserDTO;
import com.example.backend.dto.PartnershipRequist.AirlinePartnershipRequest;
import com.example.backend.entity.Airline;
import com.example.backend.entity.User;
import com.example.backend.repository.AirlineRepository;
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
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AirlinePartnershipServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private AirlineRepository airlineRepository;

    @Mock
    private FileStorageService fileStorageService;

    @Mock
    private AuthService authService;

    @InjectMocks
    private PartnershipService partnershipService;

    @Test
    public void testSubmitAirlinePartnership_Success() throws IOException {
        // Given
        AirlinePartnershipRequest request = new AirlinePartnershipRequest();
        request.setAirlineName("TestAir");
        request.setAirlineNationality("TestLand");
        request.setAdminFirstName("John");
        request.setAdminLastName("Doe");
        request.setAdminPhone("1234567890");
        request.setManagerEmail("manager@test.com");
        request.setManagerPassword("secret");
        MockMultipartFile logo = new MockMultipartFile("airlineLogo", "logo.png", "image/png", "data".getBytes());
        request.setAirlineLogo(logo);

        when(userRepository.existsByEmail(request.getManagerEmail())).thenReturn(false);
        when(airlineRepository.existsByAirlineName(request.getAirlineName())).thenReturn(false);

        // Mock AuthService signup success
        doNothing().when(authService).SignUp(any(UserDTO.class), eq(User.UserRole.AIRLINE_ADMIN));

        User savedUser = new User();
        savedUser.setUserID(10);
        savedUser.setEmail(request.getManagerEmail());
        when(userRepository.findByEmail(request.getManagerEmail())).thenReturn(java.util.Optional.of(savedUser));

        Airline savedAirline = new Airline();
        savedAirline.setAirlineID(20);
        when(airlineRepository.save(any(Airline.class))).thenReturn(savedAirline);

        when(fileStorageService.storeFile(any())).thenReturn("http://example.com/logo.png");

        partnershipService.submitAirlinePartnership(request);

        verify(userRepository).existsByEmail(request.getManagerEmail());
        verify(airlineRepository).existsByAirlineName(request.getAirlineName());
        verify(authService).SignUp(any(UserDTO.class), eq(User.UserRole.AIRLINE_ADMIN));
        verify(userRepository).findByEmail(request.getManagerEmail());
        verify(airlineRepository).save(any(Airline.class));
        verify(fileStorageService).storeFile(any());
    }

    @Test
    public void testSubmitAirlinePartnership_ManagerEmailExists_Throws() {
        // Given
        AirlinePartnershipRequest request = new AirlinePartnershipRequest();
        request.setManagerEmail("existing@test.com");
        request.setAirlineName("TestAirline");

        when(userRepository.existsByEmail(request.getManagerEmail())).thenReturn(true);

        // When & Then
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> partnershipService.submitAirlinePartnership(request));

        assertTrue(ex.getMessage().contains(request.getManagerEmail()));

        verify(userRepository).existsByEmail(request.getManagerEmail());
        verify(airlineRepository, never()).existsByAirlineName(anyString());
        verifyNoInteractions(authService);
        verify(airlineRepository, never()).save(any());
    }

    @Test
    public void testSubmitAirlinePartnership_AirlineNameExists_Throws() {
        // Given
        AirlinePartnershipRequest request = new AirlinePartnershipRequest();
        request.setManagerEmail("new@test.com");
        request.setAirlineName("ExistingAir");

        when(userRepository.existsByEmail(request.getManagerEmail())).thenReturn(false);
        when(airlineRepository.existsByAirlineName(request.getAirlineName())).thenReturn(true);

        // When & Then
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> partnershipService.submitAirlinePartnership(request));

        assertTrue(ex.getMessage().contains(request.getAirlineName()));

        verify(userRepository).existsByEmail(request.getManagerEmail());
        verify(airlineRepository).existsByAirlineName(request.getAirlineName());
        verifyNoInteractions(authService);
        verify(airlineRepository, never()).save(any());
    }

    @Test
    public void testSubmitAirlinePartnership_AuthServiceFails_Throws() throws IOException {
        // Given
        AirlinePartnershipRequest request = new AirlinePartnershipRequest();
        request.setAirlineName("TestAir");
        request.setManagerEmail("manager@test.com");
        request.setManagerPassword("secret");

        when(userRepository.existsByEmail(request.getManagerEmail())).thenReturn(false);
        when(airlineRepository.existsByAirlineName(request.getAirlineName())).thenReturn(false);

        // Mock AuthService signup failure
        doThrow(new IllegalArgumentException("Failed to create admin user")).when(authService)
                .SignUp(any(UserDTO.class), eq(User.UserRole.AIRLINE_ADMIN));

        // When & Then
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> partnershipService.submitAirlinePartnership(request));

        assertTrue(ex.getMessage().contains("Failed to create admin user"));

        verify(authService).SignUp(any(UserDTO.class), eq(User.UserRole.AIRLINE_ADMIN));
        verify(userRepository, never()).findByEmail(anyString());
        verify(airlineRepository, never()).save(any());
    }

    @Test
    public void testSubmitAirlinePartnership_UserNotFoundAfterSignup_Throws() throws IOException {
        // Given
        AirlinePartnershipRequest request = new AirlinePartnershipRequest();
        request.setAirlineName("TestAir");
        request.setManagerEmail("manager@test.com");
        request.setManagerPassword("secret");

        when(userRepository.existsByEmail(request.getManagerEmail())).thenReturn(false);
        when(airlineRepository.existsByAirlineName(request.getAirlineName())).thenReturn(false);

        // Mock AuthService signup success but user not found in repository
        doNothing().when(authService).SignUp(any(UserDTO.class), eq(User.UserRole.AIRLINE_ADMIN));
        when(userRepository.findByEmail(request.getManagerEmail())).thenReturn(java.util.Optional.empty());

        // When & Then
        IllegalStateException ex = assertThrows(IllegalStateException.class,
                () -> partnershipService.submitAirlinePartnership(request));

        assertTrue(ex.getMessage().contains("Failed to retrieve saved admin user"));

        verify(authService).SignUp(any(UserDTO.class), eq(User.UserRole.AIRLINE_ADMIN));
        verify(userRepository).findByEmail(request.getManagerEmail());
        verify(airlineRepository, never()).save(any());
    }

    @Test
    public void testSubmitAirlinePartnership_NoLogo_Success() throws IOException {
        // Given
        AirlinePartnershipRequest request = new AirlinePartnershipRequest();
        request.setAirlineName("NoLogoAir");
        request.setManagerEmail("nologo@test.com");
        request.setManagerPassword("pwd");

        when(userRepository.existsByEmail(request.getManagerEmail())).thenReturn(false);
        when(airlineRepository.existsByAirlineName(request.getAirlineName())).thenReturn(false);

        doNothing().when(authService).SignUp(any(UserDTO.class), eq(User.UserRole.AIRLINE_ADMIN));

        User savedUser = new User();
        savedUser.setUserID(30);
        savedUser.setEmail(request.getManagerEmail());
        when(userRepository.findByEmail(request.getManagerEmail())).thenReturn(java.util.Optional.of(savedUser));

        Airline savedAirline = new Airline();
        savedAirline.setAirlineID(31);
        when(airlineRepository.save(any(Airline.class))).thenReturn(savedAirline);

        // No logo provided
        request.setAirlineLogo(null);

        partnershipService.submitAirlinePartnership(request);

        verify(fileStorageService, never()).storeFile(any());
        verify(airlineRepository).save(any(Airline.class));
    }

    @Test
    public void testSubmitAirlinePartnership_FileStorageThrows_ThrowsIOException() throws IOException {
        // Given
        AirlinePartnershipRequest request = new AirlinePartnershipRequest();
        request.setAirlineName("FailAir");
        request.setManagerEmail("fail@test.com");
        request.setManagerPassword("pwd");
        MockMultipartFile logo = new MockMultipartFile("airlineLogo", "logo.png", "image/png", "data".getBytes());
        request.setAirlineLogo(logo);

        when(userRepository.existsByEmail(request.getManagerEmail())).thenReturn(false);
        when(airlineRepository.existsByAirlineName(request.getAirlineName())).thenReturn(false);

        doNothing().when(authService).SignUp(any(UserDTO.class), eq(User.UserRole.AIRLINE_ADMIN));

        User savedUser = new User();
        savedUser.setUserID(40);
        savedUser.setEmail(request.getManagerEmail());
        when(userRepository.findByEmail(request.getManagerEmail())).thenReturn(java.util.Optional.of(savedUser));

        when(fileStorageService.storeFile(any())).thenThrow(new IOException("upload failed"));

        // When & Then
        IOException ex = assertThrows(IOException.class,
                () -> partnershipService.submitAirlinePartnership(request));

        assertTrue(ex.getMessage().contains("upload failed"));

        // airline should not be saved if upload fails
        verify(airlineRepository, never()).save(any());
    }

    @Test
    public void testSubmitAirlinePartnership_VerifySavedAirlineFields() throws IOException {
        // Given
        AirlinePartnershipRequest request = new AirlinePartnershipRequest();
        request.setAirlineName("CaptureAir");
        request.setAirlineNationality("CapLand");
        request.setAdminFirstName("Cap");
        request.setAdminLastName("Ture");
        request.setAdminPhone("000111222");
        request.setManagerEmail("capture@test.com");
        request.setManagerPassword("pwd");
        MockMultipartFile logo = new MockMultipartFile("airlineLogo", "logo.png", "image/png", "data".getBytes());
        request.setAirlineLogo(logo);

        when(userRepository.existsByEmail(request.getManagerEmail())).thenReturn(false);
        when(airlineRepository.existsByAirlineName(request.getAirlineName())).thenReturn(false);

        doNothing().when(authService).SignUp(any(UserDTO.class), eq(User.UserRole.AIRLINE_ADMIN));

        User savedUser = new User();
        savedUser.setUserID(50);
        savedUser.setEmail(request.getManagerEmail());
        when(userRepository.findByEmail(request.getManagerEmail())).thenReturn(java.util.Optional.of(savedUser));

        Airline savedAirline = new Airline();
        savedAirline.setAirlineID(51);
        when(airlineRepository.save(any(Airline.class))).thenReturn(savedAirline);

        when(fileStorageService.storeFile(any())).thenReturn("http://example.com/cap.png");

        partnershipService.submitAirlinePartnership(request);

        // capture the airline passed to save
        org.mockito.ArgumentCaptor<Airline> captor = org.mockito.ArgumentCaptor.forClass(Airline.class);
        verify(airlineRepository).save(captor.capture());
        Airline captured = captor.getValue();

        assertEquals(request.getAirlineName(), captured.getAirlineName());
        assertEquals(request.getAirlineNationality(), captured.getAirlineNationality());
        assertEquals(savedUser, captured.getAdmin());
        assertEquals(0.0f, captured.getAirlineRate(), 0.001f);
        assertEquals(0, captured.getNumberOfRates());
        assertEquals(Airline.Status.INACTIVE, captured.getStatus());
        assertEquals("http://example.com/cap.png", captured.getLogoUrl());
        assertNotNull(captured.getCreatedAt());
    }
}

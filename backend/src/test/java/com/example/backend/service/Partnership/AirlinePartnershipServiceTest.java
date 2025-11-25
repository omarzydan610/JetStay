package com.example.backend.service.Partnership;

import com.example.backend.dto.PartnershipRequist.AirlinePartnershipRequest;
import com.example.backend.entity.Airline;
import com.example.backend.entity.User;
import com.example.backend.repository.AirlineRepository;
import com.example.backend.repository.UserRepository;
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

    @InjectMocks
    private PartnershipService partnershipService;

    @Test
    public void testSubmitAirlinePartnership_Success() throws IOException {
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

        User savedUser = new User();
        savedUser.setUserID(10);
        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        Airline savedAirline = new Airline();
        savedAirline.setAirlineID(20);
        when(airlineRepository.save(any(Airline.class))).thenReturn(savedAirline);

        when(fileStorageService.storeFile(any())).thenReturn("http://example.com/logo.png");

        String response = partnershipService.submitAirlinePartnership(request);

        assertNotNull(response);
        assertTrue(response.contains("20"));

        verify(userRepository).existsByEmail(request.getManagerEmail());
        verify(airlineRepository).existsByAirlineName(request.getAirlineName());
        verify(userRepository).save(any(User.class));
        verify(airlineRepository).save(any(Airline.class));
        verify(fileStorageService).storeFile(any());
    }

    @Test
    public void testSubmitAirlinePartnership_ManagerEmailExists_Throws() {
        AirlinePartnershipRequest request = new AirlinePartnershipRequest();
        request.setManagerEmail("existing@test.com");
        request.setAirlineName("TestAirline");

        when(userRepository.existsByEmail(request.getManagerEmail())).thenReturn(true);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> partnershipService.submitAirlinePartnership(request));

        assertTrue(ex.getMessage().contains(request.getManagerEmail()));

        verify(userRepository).existsByEmail(request.getManagerEmail());
        verifyNoInteractions(airlineRepository);
    }

    @Test
    public void testSubmitAirlinePartnership_AirlineNameExists_Throws() {
        AirlinePartnershipRequest request = new AirlinePartnershipRequest();
        request.setManagerEmail("new@test.com");
        request.setAirlineName("ExistingAir");

        when(userRepository.existsByEmail(request.getManagerEmail())).thenReturn(false);
        when(airlineRepository.existsByAirlineName(request.getAirlineName())).thenReturn(true);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> partnershipService.submitAirlinePartnership(request));

        assertTrue(ex.getMessage().contains(request.getAirlineName()));

        verify(userRepository).existsByEmail(request.getManagerEmail());
        verify(airlineRepository).existsByAirlineName(request.getAirlineName());
        verify(userRepository, never()).save(any());
    }

    @Test
    public void testSubmitAirlinePartnership_NoLogo_Success() throws IOException {
        AirlinePartnershipRequest request = new AirlinePartnershipRequest();
        request.setAirlineName("NoLogoAir");
        request.setManagerEmail("nologo@test.com");
        request.setManagerPassword("pwd");

        when(userRepository.existsByEmail(request.getManagerEmail())).thenReturn(false);
        when(airlineRepository.existsByAirlineName(request.getAirlineName())).thenReturn(false);

        User savedUser = new User();
        savedUser.setUserID(30);
        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        Airline savedAirline = new Airline();
        savedAirline.setAirlineID(31);
        when(airlineRepository.save(any(Airline.class))).thenReturn(savedAirline);

        // No logo provided
        request.setAirlineLogo(null);

        String response = partnershipService.submitAirlinePartnership(request);

        assertNotNull(response);
        assertTrue(response.contains("31"));

        verify(fileStorageService, never()).storeFile(any());
        verify(airlineRepository).save(any(Airline.class));
    }

    @Test
    public void testSubmitAirlinePartnership_FileStorageThrows_ThrowsIOException() throws IOException {
        AirlinePartnershipRequest request = new AirlinePartnershipRequest();
        request.setAirlineName("FailAir");
        request.setManagerEmail("fail@test.com");
        request.setManagerPassword("pwd");
        MockMultipartFile logo = new MockMultipartFile("airlineLogo", "logo.png", "image/png", "data".getBytes());
        request.setAirlineLogo(logo);

        when(userRepository.existsByEmail(request.getManagerEmail())).thenReturn(false);
        when(airlineRepository.existsByAirlineName(request.getAirlineName())).thenReturn(false);

        User savedUser = new User();
        savedUser.setUserID(40);
        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        when(fileStorageService.storeFile(any())).thenThrow(new IOException("upload failed"));

        IOException ex = assertThrows(IOException.class,
                () -> partnershipService.submitAirlinePartnership(request));

        assertTrue(ex.getMessage().contains("upload failed"));

        // airline should not be saved if upload fails
        verify(airlineRepository, never()).save(any());
    }

    @Test
    public void testSubmitAirlinePartnership_VerifySavedAirlineFields() throws IOException {
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

        User savedUser = new User();
        savedUser.setUserID(50);
        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        Airline savedAirline = new Airline();
        savedAirline.setAirlineID(51);
        when(airlineRepository.save(any(Airline.class))).thenReturn(savedAirline);

        when(fileStorageService.storeFile(any())).thenReturn("http://example.com/cap.png");

        String response = partnershipService.submitAirlinePartnership(request);

        assertNotNull(response);

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
    }
}

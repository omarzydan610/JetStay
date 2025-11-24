package com.example.backend.service.Partnership;

import com.example.backend.dto.PartnershipRequist.HotelPartnershipRequest;
import com.example.backend.entity.Hotel;
import com.example.backend.entity.User;
import com.example.backend.repository.HotelRepository;
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
public class HotelPartnershipServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private HotelRepository hotelRepository;

    @Mock
    private FileStorageService fileStorageService;

    @InjectMocks
    private HotelPartnershipService hotelPartnershipService;

    @Test
    public void testSubmitHotelPartnership_Success() throws IOException {
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

        User savedUser = new User();
        savedUser.setUserID(11);
        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        Hotel savedHotel = new Hotel();
        savedHotel.setHotelID(21);
        when(hotelRepository.save(any(Hotel.class))).thenReturn(savedHotel);

        when(fileStorageService.storeFile(any())).thenReturn("http://example.com/hotel.png");

        String response = hotelPartnershipService.submitHotelPartnership(request);

        assertNotNull(response);
        assertTrue(response.contains("21"));

        verify(userRepository).existsByEmail(request.getManagerEmail());
        verify(userRepository).save(any(User.class));
        verify(hotelRepository).save(any(Hotel.class));
        verify(fileStorageService).storeFile(any());
    }

    @Test
    public void testSubmitHotelPartnership_ManagerEmailExists_Throws() {
        HotelPartnershipRequest request = new HotelPartnershipRequest();
        request.setManagerEmail("exists@hotel.com");

        when(userRepository.existsByEmail(request.getManagerEmail())).thenReturn(true);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> hotelPartnershipService.submitHotelPartnership(request));

        assertTrue(ex.getMessage().contains(request.getManagerEmail()));

        verify(userRepository).existsByEmail(request.getManagerEmail());
        verifyNoInteractions(hotelRepository);
    }

    @Test
    public void testSubmitHotelPartnership_NoLogo_Success() throws IOException {
        HotelPartnershipRequest request = new HotelPartnershipRequest();
        request.setHotelName("NoLogoHotel");
        request.setManagerEmail("nologo@hotel.com");
        request.setManagerPassword("pwd");

        when(userRepository.existsByEmail(request.getManagerEmail())).thenReturn(false);

        User savedUser = new User();
        savedUser.setUserID(60);
        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        Hotel savedHotel = new Hotel();
        savedHotel.setHotelID(61);
        when(hotelRepository.save(any(Hotel.class))).thenReturn(savedHotel);

        request.setHotelLogo(null);

        String response = hotelPartnershipService.submitHotelPartnership(request);

        assertNotNull(response);
        assertTrue(response.contains("61"));

        verify(fileStorageService, never()).storeFile(any());
        verify(hotelRepository).save(any(Hotel.class));
    }

    @Test
    public void testSubmitHotelPartnership_FileStorageThrows_ThrowsIOException() throws IOException {
        HotelPartnershipRequest request = new HotelPartnershipRequest();
        request.setHotelName("FailHotel");
        request.setManagerEmail("fail@hotel.com");
        request.setManagerPassword("pwd");
        MockMultipartFile logo = new MockMultipartFile("hotelLogo", "logo.png", "image/png", "data".getBytes());
        request.setHotelLogo(logo);

        when(userRepository.existsByEmail(request.getManagerEmail())).thenReturn(false);

        User savedUser = new User();
        savedUser.setUserID(70);
        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        when(fileStorageService.storeFile(any())).thenThrow(new IOException("upload failed"));

        IOException ex = assertThrows(IOException.class,
                () -> hotelPartnershipService.submitHotelPartnership(request));

        assertTrue(ex.getMessage().contains("upload failed"));

        verify(hotelRepository, never()).save(any());
    }

    @Test
    public void testSubmitHotelPartnership_VerifySavedHotelFields() throws IOException {
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

        User savedUser = new User();
        savedUser.setUserID(80);
        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        Hotel savedHotel = new Hotel();
        savedHotel.setHotelID(81);
        when(hotelRepository.save(any(Hotel.class))).thenReturn(savedHotel);

        when(fileStorageService.storeFile(any())).thenReturn("http://example.com/hcap.png");

        String response = hotelPartnershipService.submitHotelPartnership(request);

        assertNotNull(response);

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
    }
}

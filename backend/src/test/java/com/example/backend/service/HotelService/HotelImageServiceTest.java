package com.example.backend.service.HotelService;

import com.example.backend.entity.Hotel;
import com.example.backend.entity.HotelImage;
import com.example.backend.entity.User;
import com.example.backend.repository.HotelImageRepository;
import com.example.backend.repository.HotelRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class HotelImageServiceTest {

    @Mock
    private HotelRepository hotelRepository;

    @Mock
    private HotelImageRepository hotelImageRepository;

    @Mock
    private HotelImagesUploader hotelImagesUploader;

    @Mock
    private MultipartFile multipartFile;

    @InjectMocks
    private HotelImageService hotelImageService;

    private Hotel hotel;
    private User admin;
    private HotelImage hotelImage;
    private final String adminEmail = "admin@example.com";
    private final String imageUrl = "https://res.cloudinary.com/demo/image/upload/test.jpg";

    @BeforeEach
    void setUp() {
        admin = new User();
        admin.setEmail(adminEmail);

        hotel = new Hotel();
        hotel.setHotelID(1);
        hotel.setAdmin(admin);

        hotelImage = new HotelImage();
        hotelImage.setImageID(1);  // Changed from setImageId to setImageID
        hotelImage.setImageUrl(imageUrl);
        hotelImage.setHotel(hotel);
    }

    @Test
    void testAddHotelImageForAdmin_Success() throws IOException {
        // Arrange
        when(hotelRepository.findByAdmin_Email(adminEmail)).thenReturn(Optional.of(hotel));
        when(hotelImagesUploader.uploadToCloudinary(any(MultipartFile.class), anyString()))
                .thenReturn(imageUrl);
        when(hotelImageRepository.save(any(HotelImage.class))).thenAnswer(invocation -> {
            HotelImage savedImage = invocation.getArgument(0);
            savedImage.setImageID(1); // Simulate DB auto-generated ID
            return savedImage;
        });

        // Act
        HotelImage result = hotelImageService.addHotelImageForAdmin(adminEmail, multipartFile);

        // Assert
        assertNotNull(result);
        assertEquals(imageUrl, result.getImageUrl());
        assertEquals(hotel, result.getHotel());
        
        verify(hotelRepository).findByAdmin_Email(adminEmail);
        verify(hotelImagesUploader).uploadToCloudinary(any(MultipartFile.class), 
                eq("jetstay/hotels/hotel_1/photos"));
        verify(hotelImageRepository).save(any(HotelImage.class));
    }

    @Test
    void testAddHotelImageForAdmin_HotelNotFound() {
        // Arrange
        when(hotelRepository.findByAdmin_Email(adminEmail)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            hotelImageService.addHotelImageForAdmin(adminEmail, multipartFile);
        });

        assertEquals("No Hotel found for admin: " + adminEmail, exception.getMessage());
        verify(hotelRepository).findByAdmin_Email(adminEmail);
        verifyNoInteractions(hotelImagesUploader, hotelImageRepository);
    }

    @Test
    void testAddHotelImageForAdmin_UploaderThrowsException() throws IOException {
        // Arrange
        when(hotelRepository.findByAdmin_Email(adminEmail)).thenReturn(Optional.of(hotel));
        when(hotelImagesUploader.uploadToCloudinary(any(MultipartFile.class), anyString()))
                .thenThrow(new IOException("Upload failed"));

        // Act & Assert
        assertThrows(IOException.class, () -> {
            hotelImageService.addHotelImageForAdmin(adminEmail, multipartFile);
        });

        verify(hotelRepository).findByAdmin_Email(adminEmail);
        verify(hotelImagesUploader).uploadToCloudinary(any(MultipartFile.class), anyString());
        verifyNoInteractions(hotelImageRepository);
    }

    @Test
    void testDeleteHotelImageForAdmin_Success() throws IOException {
        // Arrange
        when(hotelImageRepository.findById(1)).thenReturn(Optional.of(hotelImage));

        // Act
        hotelImageService.deleteHotelImageForAdmin(1, adminEmail);

        // Assert
        verify(hotelImageRepository).findById(1);
        verify(hotelImagesUploader).deleteFromCloudinary(imageUrl);
        verify(hotelImageRepository).delete(hotelImage);
    }

    @Test
    void testDeleteHotelImageForAdmin_ImageNotFound() {
        // Arrange
        when(hotelImageRepository.findById(1)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            hotelImageService.deleteHotelImageForAdmin(1, adminEmail);
        });

        assertEquals("Image not found with ID: 1", exception.getMessage());
        verify(hotelImageRepository).findById(1);
        verifyNoInteractions(hotelImagesUploader);
    }

    @Test
    void testDeleteHotelImageForAdmin_Unauthorized() {
        // Arrange
        String differentEmail = "different@example.com";
        when(hotelImageRepository.findById(1)).thenReturn(Optional.of(hotelImage));

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            hotelImageService.deleteHotelImageForAdmin(1, differentEmail);
        });

        assertEquals("Unauthorized: You do not own this image", exception.getMessage());
        verify(hotelImageRepository).findById(1);
        verifyNoInteractions(hotelImagesUploader);
    }

    @Test
    void testGetHotelImagesForAdmin_Success() {
        // Arrange
        List<HotelImage> expectedImages = Arrays.asList(hotelImage);
        when(hotelRepository.findByAdmin_Email(adminEmail)).thenReturn(Optional.of(hotel));
        when(hotelImageRepository.findByHotelHotelID(1)).thenReturn(expectedImages);

        // Act
        List<HotelImage> result = hotelImageService.getHotelImagesForAdmin(adminEmail);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(hotelImage, result.get(0));
        verify(hotelRepository).findByAdmin_Email(adminEmail);
        verify(hotelImageRepository).findByHotelHotelID(1);
    }

    @Test
    void testGetHotelImagesForAdmin_HotelNotFound() {
        // Arrange
        when(hotelRepository.findByAdmin_Email(adminEmail)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            hotelImageService.getHotelImagesForAdmin(adminEmail);
        });

        assertEquals("No Hotel found for admin: " + adminEmail, exception.getMessage());
        verify(hotelRepository).findByAdmin_Email(adminEmail);
        verifyNoInteractions(hotelImageRepository);
    }

    @Test
    void testDeleteHotelImageForAdmin_DeleteFails() throws IOException {
        // Arrange
        when(hotelImageRepository.findById(1)).thenReturn(Optional.of(hotelImage));
        doThrow(new IOException("Delete failed")).when(hotelImagesUploader).deleteFromCloudinary(imageUrl);

        // Act & Assert
        assertThrows(IOException.class, () -> {
            hotelImageService.deleteHotelImageForAdmin(1, adminEmail);
        });

        verify(hotelImageRepository).findById(1);
        verify(hotelImagesUploader).deleteFromCloudinary(imageUrl);
        verify(hotelImageRepository, never()).delete(any());
    }

    @Test
    void testAddHotelImageForAdmin_VerifiesFolderPath() throws IOException {
        // Arrange
        when(hotelRepository.findByAdmin_Email(adminEmail)).thenReturn(Optional.of(hotel));
        when(hotelImagesUploader.uploadToCloudinary(any(MultipartFile.class), anyString()))
                .thenReturn(imageUrl);
        when(hotelImageRepository.save(any(HotelImage.class))).thenReturn(hotelImage);

        // Act
        hotelImageService.addHotelImageForAdmin(adminEmail, multipartFile);

        // Assert - verify the exact folder path
        verify(hotelImagesUploader).uploadToCloudinary(eq(multipartFile), 
                eq("jetstay/hotels/hotel_1/photos"));
    }
}
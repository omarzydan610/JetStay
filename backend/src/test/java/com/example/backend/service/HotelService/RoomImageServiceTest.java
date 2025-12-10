package com.example.backend.service.HotelService;

import com.example.backend.entity.Hotel;
import com.example.backend.entity.RoomImage;
import com.example.backend.entity.RoomType;
import com.example.backend.entity.User;
import com.example.backend.repository.RoomImageRepository;
import com.example.backend.repository.RoomTypeRepository;
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
public class RoomImageServiceTest {

    @Mock
    private RoomTypeRepository roomTypeRepository;

    @Mock
    private RoomImageRepository roomImageRepository;

    @Mock
    private HotelImagesUploader hotelImagesUploader;

    @Mock
    private MultipartFile multipartFile;

    @InjectMocks
    private RoomImageService roomImageService;

    private RoomType roomType;
    private Hotel hotel;
    private User admin;
    private RoomImage roomImage;
    private final String adminEmail = "admin@example.com";
    private final String imageUrl = "https://res.cloudinary.com/demo/image/upload/test.jpg";
    private final Integer roomTypeId = 1;
    private final Integer hotelId = 1;
    private final Integer imageId = 1;

    @BeforeEach
    void setUp() {
        admin = new User();
        admin.setEmail(adminEmail);

        hotel = new Hotel();
        hotel.setHotelID(hotelId);
        hotel.setAdmin(admin);

        roomType = new RoomType();
        roomType.setRoomTypeID(roomTypeId);
        roomType.setHotel(hotel);

        roomImage = new RoomImage();
        roomImage.setImageID(imageId);  // This might need adjustment based on your RoomImage entity
        roomImage.setImageUrl(imageUrl);
        roomImage.setRoomType(roomType);
    }

    @Test
    void testAddRoomImage_Success() throws IOException {
        // Arrange
        when(roomTypeRepository.findById(roomTypeId)).thenReturn(Optional.of(roomType));
        when(hotelImagesUploader.uploadToCloudinary(any(MultipartFile.class), anyString()))
                .thenReturn(imageUrl);
        when(roomImageRepository.save(any(RoomImage.class))).thenAnswer(invocation -> {
            RoomImage savedImage = invocation.getArgument(0);
            savedImage.setImageID(1); // Simulate DB auto-generated ID
            return savedImage;
        });

        // Act
        RoomImage result = roomImageService.addRoomImage(roomTypeId, multipartFile, adminEmail);

        // Assert
        assertNotNull(result);
        assertEquals(imageUrl, result.getImageUrl());
        assertEquals(roomType, result.getRoomType());
        
        verify(roomTypeRepository).findById(roomTypeId);
        verify(hotelImagesUploader).uploadToCloudinary(any(MultipartFile.class), 
                eq("jetstay/hotels/hotel_1/rooms/room_type_1"));
        verify(roomImageRepository).save(any(RoomImage.class));
    }

    @Test
    void testAddRoomImage_RoomTypeNotFound() {
        // Arrange
        when(roomTypeRepository.findById(roomTypeId)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            roomImageService.addRoomImage(roomTypeId, multipartFile, adminEmail);
        });

        assertEquals("Room Type not found with ID: " + roomTypeId, exception.getMessage());
        verify(roomTypeRepository).findById(roomTypeId);
        verifyNoInteractions(hotelImagesUploader, roomImageRepository);
    }

    @Test
    void testAddRoomImage_Unauthorized() {
        // Arrange
        String differentEmail = "different@example.com";
        when(roomTypeRepository.findById(roomTypeId)).thenReturn(Optional.of(roomType));

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            roomImageService.addRoomImage(roomTypeId, multipartFile, differentEmail);
        });

        assertEquals("Unauthorized: You do not own this Room Type", exception.getMessage());
        verify(roomTypeRepository).findById(roomTypeId);
        verifyNoInteractions(hotelImagesUploader, roomImageRepository);
    }

    @Test
    void testAddRoomImage_UploaderThrowsException() throws IOException {
        // Arrange
        when(roomTypeRepository.findById(roomTypeId)).thenReturn(Optional.of(roomType));
        when(hotelImagesUploader.uploadToCloudinary(any(MultipartFile.class), anyString()))
                .thenThrow(new IOException("Upload failed"));

        // Act & Assert
        assertThrows(IOException.class, () -> {
            roomImageService.addRoomImage(roomTypeId, multipartFile, adminEmail);
        });

        verify(roomTypeRepository).findById(roomTypeId);
        verify(hotelImagesUploader).uploadToCloudinary(any(MultipartFile.class), anyString());
        verifyNoInteractions(roomImageRepository);
    }

    @Test
    void testDeleteRoomImage_Success() throws IOException {
        // Arrange
        when(roomImageRepository.findById(imageId)).thenReturn(Optional.of(roomImage));

        // Act
        roomImageService.deleteRoomImage(imageId, adminEmail);

        // Assert
        verify(roomImageRepository).findById(imageId);
        verify(hotelImagesUploader).deleteFromCloudinary(imageUrl);
        verify(roomImageRepository).delete(roomImage);
    }

    @Test
    void testDeleteRoomImage_ImageNotFound() {
        // Arrange
        when(roomImageRepository.findById(imageId)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            roomImageService.deleteRoomImage(imageId, adminEmail);
        });

        assertEquals("Image not found with ID: " + imageId, exception.getMessage());
        verify(roomImageRepository).findById(imageId);
        verifyNoInteractions(hotelImagesUploader);
    }

    @Test
    void testDeleteRoomImage_Unauthorized() {
        // Arrange
        String differentEmail = "different@example.com";
        when(roomImageRepository.findById(imageId)).thenReturn(Optional.of(roomImage));

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            roomImageService.deleteRoomImage(imageId, differentEmail);
        });

        assertEquals("Unauthorized: You do not own this image", exception.getMessage());
        verify(roomImageRepository).findById(imageId);
        verifyNoInteractions(hotelImagesUploader);
    }

    @Test
    void testGetRoomImages_Success() {
        // Arrange
        List<RoomImage> expectedImages = Arrays.asList(roomImage);
        when(roomImageRepository.findByRoomTypeRoomTypeID(roomTypeId)).thenReturn(expectedImages);

        // Act
        List<RoomImage> result = roomImageService.getRoomImages(roomTypeId);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(roomImage, result.get(0));
        verify(roomImageRepository).findByRoomTypeRoomTypeID(roomTypeId);
    }

    @Test
    void testDeleteRoomImage_DeleteFails() throws IOException {
        // Arrange
        when(roomImageRepository.findById(imageId)).thenReturn(Optional.of(roomImage));
        doThrow(new IOException("Delete failed")).when(hotelImagesUploader).deleteFromCloudinary(imageUrl);

        // Act & Assert
        assertThrows(IOException.class, () -> {
            roomImageService.deleteRoomImage(imageId, adminEmail);
        });

        verify(roomImageRepository).findById(imageId);
        verify(hotelImagesUploader).deleteFromCloudinary(imageUrl);
        verify(roomImageRepository, never()).delete(any());
    }

    @Test
    void testGetRoomImages_EmptyList() {
        // Arrange
        when(roomImageRepository.findByRoomTypeRoomTypeID(roomTypeId)).thenReturn(Arrays.asList());

        // Act
        List<RoomImage> result = roomImageService.getRoomImages(roomTypeId);

        // Assert
        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(roomImageRepository).findByRoomTypeRoomTypeID(roomTypeId);
    }

    @Test
    void testAddRoomImage_VerifiesFolderPath() throws IOException {
        // Arrange
        when(roomTypeRepository.findById(roomTypeId)).thenReturn(Optional.of(roomType));
        when(hotelImagesUploader.uploadToCloudinary(any(MultipartFile.class), anyString()))
                .thenReturn(imageUrl);
        when(roomImageRepository.save(any(RoomImage.class))).thenReturn(roomImage);

        // Act
        roomImageService.addRoomImage(roomTypeId, multipartFile, adminEmail);

        // Assert - verify the exact folder path
        verify(hotelImagesUploader).uploadToCloudinary(eq(multipartFile), 
                eq("jetstay/hotels/hotel_1/rooms/room_type_1"));
    }
}
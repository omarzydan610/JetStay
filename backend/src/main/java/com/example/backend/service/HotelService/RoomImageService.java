package com.example.backend.service.HotelService;

import com.example.backend.entity.RoomImage;
import com.example.backend.entity.RoomType;
import com.example.backend.repository.RoomImageRepository;
import com.example.backend.repository.RoomTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.io.IOException;

@Service
public class RoomImageService {

    @Autowired
    private RoomTypeRepository roomTypeRepository;

    @Autowired
    private RoomImageRepository roomImageRepository;

    @Autowired
    private HotelImagesUploader hotelImagesUploader;

    private static final String BASE_FOLDER = "jetstay";

    @Transactional
    public RoomImage addRoomImage(Integer roomTypeId, MultipartFile file, String adminEmail) throws IOException {
        RoomType roomType = roomTypeRepository.findById(roomTypeId)
                .orElseThrow(() -> new RuntimeException("Room Type not found with ID: " + roomTypeId));

        String ownerEmail = roomType.getHotel().getAdmin().getEmail();
        if (!ownerEmail.equals(adminEmail)) {
            throw new RuntimeException("Unauthorized: You do not own this Room Type");
        }

        Integer hotelId = roomType.getHotel().getHotelID();
        String folderPath = BASE_FOLDER + "/hotels/hotel_" + hotelId + "/rooms/room_type_" + roomTypeId;

        String imageUrl = hotelImagesUploader.uploadToCloudinary(file, folderPath);

        RoomImage roomImage = new RoomImage();
        roomImage.setRoomType(roomType);
        roomImage.setImageUrl(imageUrl);

        return roomImageRepository.save(roomImage);
    }

    @Transactional
    public void deleteRoomImage(Integer imageId, String adminEmail) throws IOException {
        RoomImage image = roomImageRepository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Image not found with ID: " + imageId));

        String ownerEmail = image.getRoomType().getHotel().getAdmin().getEmail();
        if (!ownerEmail.equals(adminEmail)) {
            throw new RuntimeException("Unauthorized: You do not own this image");
        }

        hotelImagesUploader.deleteFromCloudinary(image.getImageUrl());
        roomImageRepository.delete(image);
    }

    public List<RoomImage> getRoomImages(Integer roomTypeId) {
        return roomImageRepository.findByRoomTypeRoomTypeID(roomTypeId);
    }
}
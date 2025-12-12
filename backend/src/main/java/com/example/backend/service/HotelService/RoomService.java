package com.example.backend.service.HotelService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.io.IOException;


import com.example.backend.dto.RoomTypeRequest;
import com.example.backend.dto.RoomTypeResponse;
import com.example.backend.entity.Hotel;
import com.example.backend.entity.RoomImage;
import com.example.backend.entity.RoomType;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.exception.UnauthorizedException;
import com.example.backend.repository.HotelRepository;
import com.example.backend.repository.RoomTypeRepository;
import com.example.backend.repository.RoomImageRepository;

@Service
public class RoomService {
    @Autowired
    private RoomTypeRepository roomTypeRepository;

    @Autowired
    private HotelRepository hotelRepository;

    @Autowired
    private RoomImageRepository roomImageRepository;

    @Autowired
    private HotelImagesUploader hotelImagesUploader;
    
    

    public RoomType getRoomTypeById(int hotelId, int roomTypeId) {
        try {
            RoomType roomType = roomTypeRepository.findById(roomTypeId).orElse(null);
            if (roomType == null) {
                throw new ResourceNotFoundException("Room type not found with ID: " + roomTypeId);
            }
            if (roomType.getHotel().getHotelID() != hotelId) {
                throw new UnauthorizedException("Room type with ID: " + roomTypeId + " does not belong to Hotel with ID: " + hotelId);
            }
            return roomType;
        } catch (Exception e) {
            throw e;
        }
    }

    public java.util.List<RoomTypeResponse> getRoomTypesByHotelId(Integer hotelId) {

        try {
            Hotel hotel = hotelRepository.findById(hotelId).orElse(null);
            if (hotel == null) {
                throw new ResourceNotFoundException("Hotel not found with ID: " + hotelId);
            }
            java.util.List<RoomTypeResponse> roomTypes = roomTypeRepository.findByHotelId(hotelId);
            return roomTypes;
        } catch (Exception e) {
            throw e;
        }
    }

    public RoomType addRoomType(RoomTypeRequest roomTypeDTO) {
        try {
            Hotel hotel = hotelRepository.findById(roomTypeDTO.getHotelId()).orElse(null);
            if (hotel == null) {
                throw new ResourceNotFoundException("Hotel not found with ID: " + roomTypeDTO.getHotelId());
            }
            RoomType roomType = new RoomType();
            roomType.setRoomTypeName(roomTypeDTO.getRoomTypeName());
            roomType.setHotel(hotel);
            roomType.setPrice(roomTypeDTO.getPrice());
            roomType.setDescription(roomTypeDTO.getDescription());
            roomType.setQuantity(roomTypeDTO.getQuantity());
            roomType.setNumberOfGuests(roomTypeDTO.getNumberOfGuests());
            return roomTypeRepository.save(roomType);
        } catch (Exception e) {
            throw e;
        }
    }

    public RoomType updateRoomType(RoomTypeRequest roomTypeDTO, int roomTypeId) {
        try {

            RoomType existingRoomType = roomTypeRepository.findById(roomTypeId).orElse(null);
            if (existingRoomType == null) {
                throw new ResourceNotFoundException("Room type not found with ID: " + roomTypeId);
            }
            existingRoomType.setRoomTypeName(roomTypeDTO.getRoomTypeName());
            existingRoomType.setPrice(roomTypeDTO.getPrice());
            existingRoomType.setDescription(roomTypeDTO.getDescription());
            existingRoomType.setQuantity(roomTypeDTO.getQuantity());
            existingRoomType.setNumberOfGuests(roomTypeDTO.getNumberOfGuests());
            return roomTypeRepository.save(existingRoomType);
        } catch (Exception e) {
            throw e;
        }

    }

    public void deleteRoomType(int hotelId, int roomTypeId) {
        try {
            RoomType roomType = roomTypeRepository.findById(roomTypeId).orElse(null);
            if (roomType == null) {
                throw new ResourceNotFoundException("Room type not found with ID: " + roomTypeId);
            }
            if (roomType.getHotel().getHotelID() != hotelId) {
                throw new UnauthorizedException("Room type with ID: " + roomTypeId + " does not belong to Hotel with ID: " + hotelId);
            }
            List<RoomImage> images = roomImageRepository.findByRoomTypeRoomTypeID(roomTypeId);
            
            for (RoomImage image : images) {
                try {
                    hotelImagesUploader.deleteFromCloudinary(image.getImageUrl());
                } catch (IOException e) {
                    System.err.println("Failed to delete image from Cloudinary: " + image.getImageUrl());
                }
                roomImageRepository.delete(image);
            }
            roomTypeRepository.deleteById(roomTypeId);
        } catch (Exception e) {
            throw e;
        }
    }
}

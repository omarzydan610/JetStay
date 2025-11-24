package com.example.backend.service.Hotel_data;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.dto.RoomTypeDTO;
import com.example.backend.dto.RoomTypeData;
import com.example.backend.entity.Hotel;
import com.example.backend.entity.RoomType;
import com.example.backend.repository.HotelRepository;
import com.example.backend.repository.RoomTypeRepository;

@Service
public class RoomTypeService {
    @Autowired
    private RoomTypeRepository roomTypeRepository;

    @Autowired
    private HotelRepository hotelRepository;

    public RoomType getRoomTypeById(int roomTypeId) {
        return roomTypeRepository.findById(roomTypeId).orElse(null);
    }

    public java.util.List<RoomTypeData> getRoomTypesByHotelId(Integer hotelId) {
        
        return roomTypeRepository.findByHotelId(hotelId);
    }

    public RoomType addRoomType(RoomTypeDTO roomTypeDTO) {
        try {
            Hotel hotel = hotelRepository.findById(roomTypeDTO.getHotelId()).orElse(null);
            if (hotel == null) {
                throw new IllegalArgumentException("Hotel not found with ID: " + roomTypeDTO.getHotelId());
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

    public RoomType updateRoomType(RoomTypeDTO roomTypeDTO, int roomTypeId) {
        try {

            RoomType existingRoomType = roomTypeRepository.findById(roomTypeId).orElse(null);
            if (existingRoomType == null) {
                throw new IllegalArgumentException("Room type not found with ID: " + roomTypeId);
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

    public void deleteRoomType(int roomTypeId) {
        roomTypeRepository.deleteById(roomTypeId);
    }
}

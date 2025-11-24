package com.example.backend.controller.Hotel_data;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.backend.dto.RoomTypeDTO;
import com.example.backend.dto.RoomTypeData;
import com.example.backend.dto.response.SuccessResponse;
import com.example.backend.entity.RoomType;
import com.example.backend.service.Hotel_data.RoomTypeService;

import java.util.List;

@RestController
@RequestMapping("/api/room-type")
public class RoomTypeController {

    @Autowired
    private RoomTypeService roomTypeService;

    // Get room types for a hotel
    @GetMapping("/hotel/{hotelId}")
    public ResponseEntity<SuccessResponse<List<RoomTypeData>>> getHotelRoomTypes(@PathVariable int hotelId) {
        List<RoomTypeData> roomTypeData = roomTypeService.getRoomTypesByHotelId(hotelId);

        return ResponseEntity.ok(
                SuccessResponse.of("Room types retrieved successfully", roomTypeData));
    }

    // Add room type
    @PostMapping("/add")
    public ResponseEntity<SuccessResponse<Void>> addRoomType(@RequestBody RoomTypeDTO roomTypeDTO) {
        roomTypeService.addRoomType(roomTypeDTO);

        return ResponseEntity.ok(
                SuccessResponse.of("Room type added successfully"));
    }

    // Update room type
    @PatchMapping("/update/{roomTypeId}")
    public ResponseEntity<SuccessResponse<Void>> updateRoomType(
            @RequestBody RoomTypeDTO roomTypeDTO,
            @PathVariable int roomTypeId) {
        roomTypeService.updateRoomType(roomTypeDTO, roomTypeId);

        return ResponseEntity.ok(
                SuccessResponse.of("Room type updated successfully"));
    }

    // Delete room type
    @DeleteMapping("/delete/{roomTypeId}")
    public ResponseEntity<SuccessResponse<Void>> deleteRoomType(@PathVariable int roomTypeId) {
        roomTypeService.deleteRoomType(roomTypeId);

        return ResponseEntity.ok(
                SuccessResponse.of("Room type deleted successfully"));
    }

    // Get one room type
    @GetMapping("/{roomTypeId}")
    public ResponseEntity<SuccessResponse<RoomType>> getRoomType(@PathVariable int roomTypeId) {
        RoomType roomType = roomTypeService.getRoomTypeById(roomTypeId);

        return ResponseEntity.ok(
                SuccessResponse.of("Room type retrieved successfully", roomType));
    }
}

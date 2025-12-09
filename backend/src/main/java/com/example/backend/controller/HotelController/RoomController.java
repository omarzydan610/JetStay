package com.example.backend.controller.HotelController;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.example.backend.dto.RoomTypeRequest;
import com.example.backend.dto.RoomTypeResponse;
import com.example.backend.dto.response.SuccessResponse;
import com.example.backend.service.HotelService.RoomService;

import io.jsonwebtoken.Claims;

import java.util.List;

@RestController
@RequestMapping("/api/room")
public class RoomController {

        @Autowired
        private RoomService roomTypeService;

        // Get room types for a hotel
        @GetMapping("/")
        public ResponseEntity<SuccessResponse<List<RoomTypeResponse>>> getHotelRoomTypes() {
                Authentication auth = SecurityContextHolder.getContext().getAuthentication();
                Claims claims = (Claims) auth.getCredentials();
                List<RoomTypeResponse> roomTypeData = roomTypeService
                                .getRoomTypesByHotelId(claims.get("hotel_id", Integer.class));

                return ResponseEntity.ok(
                                SuccessResponse.of("Room types retrieved successfully", roomTypeData));
        }

        // Add room type
        @PostMapping("/add")
        public ResponseEntity<SuccessResponse<Void>> addRoomType(@RequestBody RoomTypeRequest roomTypeDTO) {
                Authentication auth = SecurityContextHolder.getContext().getAuthentication();
                Claims claims = (Claims) auth.getCredentials();
                roomTypeDTO.setHotelId(claims.get("hotel_id", Integer.class));
                roomTypeService.addRoomType(roomTypeDTO);

                return ResponseEntity.ok(
                                SuccessResponse.of("Room type added successfully"));
        }

        // Update room type
        @PatchMapping("/update/{roomTypeId}")
        public ResponseEntity<SuccessResponse<Void>> updateRoomType(
                        @RequestBody RoomTypeRequest roomTypeDTO,
                        @PathVariable int roomTypeId) {
                Authentication auth = SecurityContextHolder.getContext().getAuthentication();
                Claims claims = (Claims) auth.getCredentials();
                roomTypeDTO.setHotelId(claims.get("hotel_id", Integer.class));
                roomTypeService.updateRoomType(roomTypeDTO, roomTypeId);

                return ResponseEntity.ok(
                                SuccessResponse.of("Room type updated successfully"));
        }

        // Delete room type
        @DeleteMapping("/delete/{roomTypeId}")
        public ResponseEntity<SuccessResponse<Void>> deleteRoomType(@PathVariable int roomTypeId) {
                Authentication auth = SecurityContextHolder.getContext().getAuthentication();
                Claims claims = (Claims) auth.getCredentials();
                int hotelId = claims.get("hotel_id", Integer.class);
                roomTypeService.deleteRoomType(hotelId, roomTypeId);

                return ResponseEntity.ok(
                                SuccessResponse.of("Room type deleted successfully"));
        }
}

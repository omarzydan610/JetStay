package com.example.backend.controller.HotelController;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.example.backend.dto.RoomTypeRequest;
import com.example.backend.dto.RoomTypeResponse;
import com.example.backend.dto.HotelDTO.RoomOfferRequest;
import com.example.backend.dto.HotelDTO.RoomOfferResponse;
import com.example.backend.dto.response.SuccessResponse;
import com.example.backend.entity.RoomImage;
import com.example.backend.entity.RoomType;
import com.example.backend.service.HotelService.RoomService;
import com.example.backend.service.HotelService.RoomImageService;
import com.example.backend.service.HotelService.RoomOfferService;

import java.io.IOException;
import io.jsonwebtoken.Claims;

import java.util.List;

@RestController
@RequestMapping("/api/room")
public class RoomController {

        @Autowired
        private RoomService roomTypeService;

        @Autowired
        private RoomImageService roomImageService;
        
        @Autowired
        private RoomOfferService roomOfferService;


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
        public ResponseEntity<SuccessResponse<RoomType>> addRoomType(@RequestBody RoomTypeRequest roomTypeDTO) {
                Authentication auth = SecurityContextHolder.getContext().getAuthentication();
                Claims claims = (Claims) auth.getCredentials();
                roomTypeDTO.setHotelId(claims.get("hotel_id", Integer.class));
                RoomType newRoom = roomTypeService.addRoomType(roomTypeDTO);
                return ResponseEntity.ok( SuccessResponse.of("Room type added successfully", newRoom));

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

        @PostMapping("/{roomTypeId}/images/add")
        public ResponseEntity<SuccessResponse<RoomImage>> uploadRoomImage(
                        @PathVariable Integer roomTypeId,
                        @RequestParam("file") MultipartFile file) throws IOException {
                
                Authentication auth = SecurityContextHolder.getContext().getAuthentication();
                Claims claims = (Claims) auth.getCredentials();
                String adminEmail = claims.getSubject(); 

                RoomImage roomImage = roomImageService.addRoomImage(roomTypeId, file, adminEmail);

                return ResponseEntity.ok(
                                SuccessResponse.of("Image uploaded successfully", roomImage));
        }

        @DeleteMapping("/images/delete/{imageId}")
        public ResponseEntity<SuccessResponse<Void>> deleteRoomImage(@PathVariable Integer imageId) throws IOException {
                Authentication auth = SecurityContextHolder.getContext().getAuthentication();
                Claims claims = (Claims) auth.getCredentials();
                String adminEmail = claims.getSubject();
                roomImageService.deleteRoomImage(imageId, adminEmail);
                return ResponseEntity.ok(
                                SuccessResponse.of("Image deleted successfully"));
        }

        @GetMapping("/{roomTypeId}/images")
        public ResponseEntity<SuccessResponse<List<RoomImage>>> getRoomImages(@PathVariable Integer roomTypeId) {
                List<RoomImage> images = roomImageService.getRoomImages(roomTypeId);
                
                return ResponseEntity.ok(
                                SuccessResponse.of("Room images retrieved successfully", images));
        }

        @PostMapping("/offers/add")
        public ResponseEntity<SuccessResponse<RoomOfferResponse>> addRoomOffer(@RequestBody RoomOfferRequest request) {
                Authentication auth = SecurityContextHolder.getContext().getAuthentication();
                Claims claims = (Claims) auth.getCredentials();
                request.setHotelId(claims.get("hotel_id", Integer.class));
                
                RoomOfferResponse response = roomOfferService.addRoomOffer(request);
                return ResponseEntity.ok(
                SuccessResponse.of("Room offer added successfully", response));
        }

        @GetMapping("/offers")
        public ResponseEntity<SuccessResponse<List<RoomOfferResponse>>> getRoomOffers() {
                Authentication auth = SecurityContextHolder.getContext().getAuthentication();
                Claims claims = (Claims) auth.getCredentials();
                int hotelId = claims.get("hotel_id", Integer.class);
                
                List<RoomOfferResponse> offers = roomOfferService.getRoomOffersByHotel(hotelId);
                return ResponseEntity.ok(
                SuccessResponse.of("Room offers retrieved successfully", offers));
        }

        @DeleteMapping("/offers/delete/{offerId}")
        public ResponseEntity<SuccessResponse<Void>> deleteRoomOffer(@PathVariable Integer offerId) {
                Authentication auth = SecurityContextHolder.getContext().getAuthentication();
                Claims claims = (Claims) auth.getCredentials();
                int hotelId = claims.get("hotel_id", Integer.class);
                
                roomOfferService.deleteRoomOffer(offerId, hotelId);
                return ResponseEntity.ok(
                SuccessResponse.of("Room offer deleted successfully"));
        }

}



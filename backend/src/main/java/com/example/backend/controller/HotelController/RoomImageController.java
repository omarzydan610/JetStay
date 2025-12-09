package com.example.backend.controller.HotelController;

import com.example.backend.entity.RoomImage;
import com.example.backend.service.HotelService.RoomImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/room-types")
public class RoomImageController {

    @Autowired
    private RoomImageService roomImageService;

    // 1. Upload Room Image
    // Endpoint: POST /api/room-types/{roomTypeId}/images
    @PostMapping("/{roomTypeId}/images")
    public ResponseEntity<?> uploadRoomImage(@PathVariable Integer roomTypeId,
                                             @RequestParam("file") MultipartFile file) {
        try {
            RoomImage savedImage = roomImageService.addRoomImage(roomTypeId, file);
            return new ResponseEntity<>(savedImage, HttpStatus.CREATED);
        } catch (IOException e) {
            return new ResponseEntity<>("Error uploading image: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    // 2. Get All Images for a Room Type
    // Endpoint: GET /api/room-types/{roomTypeId}/images
    @GetMapping("/{roomTypeId}/images")
    public ResponseEntity<List<RoomImage>> getRoomImages(@PathVariable Integer roomTypeId) {
        List<RoomImage> images = roomImageService.getRoomImages(roomTypeId);
        return new ResponseEntity<>(images, HttpStatus.OK);
    }

    // 3. Delete Room Image
    // Endpoint: DELETE /api/room-types/images/{imageId}
    @DeleteMapping("/images/{imageId}")
    public ResponseEntity<?> deleteRoomImage(@PathVariable Integer imageId) {
        try {
            roomImageService.deleteRoomImage(imageId);
            return new ResponseEntity<>("Image deleted successfully", HttpStatus.OK);
        } catch (IOException e) {
            return new ResponseEntity<>("Error deleting image from Cloudinary: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }
}
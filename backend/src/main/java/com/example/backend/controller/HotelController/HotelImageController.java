package com.example.backend.controller.HotelController;

import com.example.backend.entity.HotelImage;
import com.example.backend.service.HotelService.HotelImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/hotels/my-hotel")
public class HotelImageController {

    @Autowired
    private HotelImageService hotelImageService;

    @PostMapping("/images")
    public ResponseEntity<?> uploadHotelImage(
            Authentication authentication,
            @RequestParam("file") MultipartFile file
    ) {
        if (file == null || file.isEmpty()) {
            return new ResponseEntity<>("File is empty", HttpStatus.BAD_REQUEST);
        }

        String adminEmail = authentication.getName();

        try {
            HotelImage savedImage = hotelImageService.addHotelImageForAdmin(adminEmail, file);
            return new ResponseEntity<>(savedImage, HttpStatus.CREATED);
        } catch (IOException e) {
            return new ResponseEntity<>("Error uploading image: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/images")
    public ResponseEntity<?> getMyHotelImages(Authentication authentication) {
        String adminEmail = authentication.getName();
        try {
            List<HotelImage> images = hotelImageService.getHotelImagesForAdmin(adminEmail);
            return new ResponseEntity<>(images, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/images/{imageId}")
    public ResponseEntity<?> deleteHotelImage(
            Authentication authentication,
            @PathVariable Integer imageId
    ) {
        String adminEmail = authentication.getName();
        try {
            hotelImageService.deleteHotelImageForAdmin(imageId, adminEmail);
            return new ResponseEntity<>("Image deleted successfully", HttpStatus.OK);
        } catch (IOException e) {
            return new ResponseEntity<>("Error deleting from Cloudinary: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (RuntimeException e) { 
            return new ResponseEntity<>(e.getMessage(), HttpStatus.FORBIDDEN); 
        }
    }
}
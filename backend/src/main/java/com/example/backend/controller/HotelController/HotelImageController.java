package com.example.backend.controller.HotelController;

import com.example.backend.entity.HotelImage;
import com.example.backend.service.HotelService.HotelImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/hotels")
public class HotelImageController {

    @Autowired
    private HotelImageService hotelImageService;

    @PostMapping("/{hotelId}/images")
    public ResponseEntity<?> uploadHotelImage(@PathVariable Integer hotelId,
                                              @RequestParam("file") MultipartFile file) {
        try {
            HotelImage savedImage = hotelImageService.addHotelImage(hotelId, file);
            return new ResponseEntity<>(savedImage, HttpStatus.CREATED);
        } catch (IOException e) {
            return new ResponseEntity<>("Error uploading image: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    // 2. Get All Images for a Hotel
    // Endpoint: GET /api/hotels/{hotelId}/images
    @GetMapping("/{hotelId}/images")
    public ResponseEntity<List<HotelImage>> getHotelImages(@PathVariable Integer hotelId) {
        List<HotelImage> images = hotelImageService.getHotelImages(hotelId);
        return new ResponseEntity<>(images, HttpStatus.OK);
    }

    // 3. Delete Hotel Image
    // Endpoint: DELETE /api/hotels/images/{imageId}
    @DeleteMapping("/images/{imageId}")
    public ResponseEntity<?> deleteHotelImage(@PathVariable Integer imageId) {
        try {
            hotelImageService.deleteHotelImage(imageId);
            return new ResponseEntity<>("Image deleted successfully", HttpStatus.OK);
        } catch (IOException e) {
            return new ResponseEntity<>("Error deleting image from Cloudinary: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }
}
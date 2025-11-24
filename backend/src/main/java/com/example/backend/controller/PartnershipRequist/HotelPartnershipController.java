// controller/HotelPartnershipController.java
package com.example.backend.controller.PartnershipRequist;

import com.example.backend.dto.PartnershipRequist.HotelPartnershipRequest;
import com.example.backend.dto.PartnershipRequist.HotelPartnershipResponse;
import com.example.backend.service.Partnership.HotelPartnershipService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/partnership")
@CrossOrigin(origins = "http://localhost:3000")
public class HotelPartnershipController {
    
    @Autowired
    private HotelPartnershipService partnershipService;
    
    @PostMapping("/hotel")
    public ResponseEntity<?> submitHotelPartnership(
            @Valid @ModelAttribute HotelPartnershipRequest request) {
        try {
            String response = partnershipService.submitHotelPartnership(request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Error processing file upload");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("An unexpected error occurred");
        }
    }
}
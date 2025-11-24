package com.example.backend.controller.PartnershipRequist;

import com.example.backend.dto.PartnershipRequist.AirlinePartnershipRequest;
import com.example.backend.dto.PartnershipRequist.AirlinePartnershipResponse;
import com.example.backend.service.Partnership.AirlinePartnershipService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/partnership")
@CrossOrigin(origins = "http://localhost:3000")
public class AirlinePartnershipController {
    
    @Autowired
    private AirlinePartnershipService partnershipService;
    
    @PostMapping("/airline")
    public ResponseEntity<?> submitAirlinePartnership(
            @Valid @ModelAttribute AirlinePartnershipRequest request) {
        try {
            AirlinePartnershipResponse response = partnershipService.submitAirlinePartnership(request);
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
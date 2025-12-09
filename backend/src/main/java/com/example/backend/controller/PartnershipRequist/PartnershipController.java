package com.example.backend.controller.PartnershipRequist;

import com.example.backend.dto.PartnershipRequist.AirlinePartnershipRequest;
import com.example.backend.dto.PartnershipRequist.HotelPartnershipRequest;
import com.example.backend.dto.response.SuccessResponse;
import com.example.backend.service.Partnership.PartnershipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.ModelAttribute;
import com.example.backend.dto.response.ErrorResponse;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/api/partnership")
public class PartnershipController {

    @Autowired
    private PartnershipService partnershipService;

    @PostMapping("/airline")
    public ResponseEntity<?> submitAirline(@ModelAttribute AirlinePartnershipRequest request) {
        try {
            partnershipService.submitAirlinePartnership(request);
            return ResponseEntity.ok(SuccessResponse.of("Airline partnership request submitted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ErrorResponse.of("Request Failed", e.getMessage(), "/api/partnership/airline"));
        }
    }

    @PostMapping("/hotel")
    public ResponseEntity<?> submitHotel(@ModelAttribute HotelPartnershipRequest request) {
        try{
            partnershipService.submitHotelPartnership(request);
            return ResponseEntity.ok(SuccessResponse.of("Hotel partnership request submitted successfully"));
        }catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ErrorResponse.of("Request Failed", e.getMessage(), "/api/partnership/hotel"));
        }
    }
}

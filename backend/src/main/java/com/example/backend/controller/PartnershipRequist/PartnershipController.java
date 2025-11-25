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

@RestController
@RequestMapping("/api/partnership")
public class PartnershipController {

    @Autowired
    private PartnershipService partnershipService;

    @PostMapping("/airline")
    public ResponseEntity<SuccessResponse<Void>> submitAirline(@ModelAttribute AirlinePartnershipRequest request) {
        partnershipService.submitAirlinePartnership(request);
        return ResponseEntity.ok(SuccessResponse.of("Airline partnership request submitted successfully"));
    }

    @PostMapping("/hotel")
    public ResponseEntity<SuccessResponse<Void>> submitHotel(@ModelAttribute HotelPartnershipRequest request) {
        partnershipService.submitHotelPartnership(request);
        return ResponseEntity.ok(SuccessResponse.of("Hotel partnership request submitted successfully"));
    }
}

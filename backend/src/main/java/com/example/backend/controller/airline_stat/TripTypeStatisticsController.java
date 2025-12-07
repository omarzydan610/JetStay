package com.example.backend.controller.airline_stat;

import com.example.backend.service.airline_stat.TripTypeStatsService;

import io.jsonwebtoken.Claims;

import com.example.backend.dto.AirlineDTO.TripTypeStatsRequestDTO;
import com.example.backend.dto.response.SuccessResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/airline/trip-type")
public class TripTypeStatisticsController {

    @Autowired
    private TripTypeStatsService tripTypeStatsService;

    @GetMapping("/")
    public ResponseEntity<SuccessResponse<TripTypeStatsRequestDTO>> getTripTypes() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Claims claims = (Claims) auth.getCredentials();
        TripTypeStatsRequestDTO data = tripTypeStatsService.getTripTypeStats(claims.get("airline_id", Integer.class));
        return ResponseEntity.ok(SuccessResponse.of("Trip type statistics retrieved successfully", data));
    }

    @GetMapping("/all")
    public ResponseEntity<SuccessResponse<TripTypeStatsRequestDTO>> getAllTripTypes() {
        TripTypeStatsRequestDTO data = tripTypeStatsService.getTripTypeStats();
        return ResponseEntity.ok(SuccessResponse.of("Trip type statistics retrieved successfully", data));
    }
}

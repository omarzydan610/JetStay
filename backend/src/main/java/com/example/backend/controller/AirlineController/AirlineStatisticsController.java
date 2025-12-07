package com.example.backend.controller.AirlineController;

import io.jsonwebtoken.Claims;

import com.example.backend.dto.AirlineDTO.AirlineStatisticsResponse;
import com.example.backend.dto.response.SuccessResponse;
import com.example.backend.service.AirlineService.AirlineStatisticsService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/airline")
public class AirlineStatisticsController {

    @Autowired
    private AirlineStatisticsService airlineStatisticsService;

    @GetMapping("/statistics")
    public ResponseEntity<SuccessResponse<AirlineStatisticsResponse>> getAirlineStatistics() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Claims claims = (Claims) auth.getCredentials();
        AirlineStatisticsResponse stats = airlineStatisticsService
                .getAirlineStatistics(claims.get("airline_id", Integer.class));
        return ResponseEntity.ok(SuccessResponse.of("Airline statistics retrieved successfully", stats));
    }

}

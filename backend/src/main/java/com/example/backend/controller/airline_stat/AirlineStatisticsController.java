package com.example.backend.controller.airline_stat;

import com.example.backend.service.airline_stat.AirlineStatService;

import io.jsonwebtoken.Claims;

import com.example.backend.dto.AirlineDTO.AirlineStatsRequestDTO;
import com.example.backend.dto.response.SuccessResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/airline")
public class AirlineStatisticsController {

    @Autowired
    private AirlineStatService airlineStatisticsService;

    @GetMapping("/")
    public ResponseEntity<SuccessResponse<AirlineStatsRequestDTO>> getAirlineStatistics() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Claims claims = (Claims) auth.getCredentials();
        AirlineStatsRequestDTO stats = airlineStatisticsService
                .getAirlineStatistics(claims.get("airline_id", Integer.class));
        return ResponseEntity.ok(SuccessResponse.of("Airline statistics retrieved successfully", stats));
    }

}

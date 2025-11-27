package com.example.backend.controller.airline_stat;

import com.example.backend.service.airline_stat.FlightStatusService;

import io.jsonwebtoken.Claims;

import com.example.backend.dto.AirlineDTO.FlightStatusRequestDTO;
import com.example.backend.dto.response.SuccessResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/airline/flight-status")
public class FlightStatusController {

    @Autowired
    private FlightStatusService flightStatusService;

    @GetMapping("/")
    public ResponseEntity<SuccessResponse<FlightStatusRequestDTO>> getFlightStatus() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Claims claims = (Claims) auth.getDetails();
        FlightStatusRequestDTO data = flightStatusService.getTicketsAndFlightSummary(claims.get("airline_id", Integer.class));
        return ResponseEntity.ok(SuccessResponse.of("Flight status retrieved successfully", data));
    }

    @GetMapping("/all")
    public ResponseEntity<SuccessResponse<FlightStatusRequestDTO>> getAllFlightsStatus() {
        FlightStatusRequestDTO data = flightStatusService.getTicketsAndFlightSummary();
        return ResponseEntity.ok(SuccessResponse.of("Flight status retrieved successfully", data));
    }
}

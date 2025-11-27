package com.example.backend.controller.airline_stat;

import com.example.backend.dto.AirlineDTO.FlightsDataRequestDTO;
import com.example.backend.dto.response.SuccessResponse;
import com.example.backend.service.airline_stat.FlightDetailService;

import io.jsonwebtoken.Claims;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/airline/details")
public class AirlineDetailedFlightsController {
    @Autowired
    private FlightDetailService flightDetailService;

    @GetMapping("/")
    public ResponseEntity<SuccessResponse<List<FlightsDataRequestDTO>>> getAirlineFlights() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Claims claims = (Claims) auth.getDetails();
        List<FlightsDataRequestDTO> flights = flightDetailService.getFlightsByAirlineID(claims.get("airline_id", Integer.class));
        return ResponseEntity.ok(SuccessResponse.of("Airline statistics retrieved successfully", flights));
    }



}


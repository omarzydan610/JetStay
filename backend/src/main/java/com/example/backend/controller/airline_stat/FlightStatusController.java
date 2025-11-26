package com.example.backend.controller.airline_stat;

import com.example.backend.service.airline_stat.FlightStatusService;
import com.example.backend.dto.AirlineDTO.FlightStatusRequestDTO;
import com.example.backend.dto.response.SuccessResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/airline/flight-status")
public class FlightStatusController {

    @Autowired
    private FlightStatusService flightStatusService;

    @GetMapping("/{airlineName}")
    public ResponseEntity<SuccessResponse<FlightStatusRequestDTO>> getFlightStatus(
            @PathVariable(required = false) String airlineName) {
        FlightStatusRequestDTO data = flightStatusService.getTicketsAndFlightSummary(airlineName);
        return ResponseEntity.ok(SuccessResponse.of("Flight status retrieved successfully", data));
    }

    @GetMapping
    public ResponseEntity<SuccessResponse<FlightStatusRequestDTO>> getAllFlightsStatus() {
        FlightStatusRequestDTO data = flightStatusService.getTicketsAndFlightSummary(null);
        return ResponseEntity.ok(SuccessResponse.of("Flight status retrieved successfully", data));
    }
}

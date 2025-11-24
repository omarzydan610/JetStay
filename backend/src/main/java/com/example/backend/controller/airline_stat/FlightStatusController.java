package com.example.backend.controller.airline_stat;

import com.example.backend.service.airline_stat.FlightStatusService;
import com.example.backend.dto.AirlineDTO.FlightStatusDTO;
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
    public ResponseEntity<SuccessResponse<FlightStatusDTO>> getFlightStatus(
            @PathVariable(required = false) String airlineName) {
        FlightStatusDTO data = flightStatusService.getTicketsAndFlightSummary(airlineName);
        return ResponseEntity.ok(SuccessResponse.of("Flight status retrieved successfully", data));
    }

    @GetMapping
    public ResponseEntity<SuccessResponse<FlightStatusDTO>> getAllFlightsStatus() {
        FlightStatusDTO data = flightStatusService.getTicketsAndFlightSummary(null);
        return ResponseEntity.ok(SuccessResponse.of("Flight status retrieved successfully", data));
    }
}

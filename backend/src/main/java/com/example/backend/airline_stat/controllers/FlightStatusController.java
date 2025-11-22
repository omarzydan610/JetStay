package com.example.backend.airline_stat.controllers;

import com.example.backend.airline_stat.service.FlightStatusService;
import com.example.backend.dto.FlightStatusDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/airline/flight-status")
public class FlightStatusController {

    @Autowired
    private FlightStatusService flightStatusService;

    @GetMapping("/{airlineName}")
    public FlightStatusDTO getFlightStatus(@PathVariable(required = false) String airlineName) {
        return flightStatusService.getTicketsAndFlightSummary(airlineName);
    }

    @GetMapping
    public FlightStatusDTO getAllFlightsStatus() {
        return flightStatusService.getTicketsAndFlightSummary(null);
    }
}

package com.example.backend.controller.airline_stat;

import com.example.backend.dto.AirlineDTO.FlightStatusDTO;
import com.example.backend.dto.AirlineDTO.FlightsDataDTO;
import com.example.backend.service.airline_stat.AirlineStatService;
import com.example.backend.dto.AirlineDTO.AirlineStatsDTO;
import com.example.backend.dto.response.SuccessResponse;
import com.example.backend.service.airline_stat.FlightDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/airline/details")
public class AirlineDetailedFlightsController {
    @Autowired
    private FlightDetailService flightDetailService;

    @GetMapping("/{airlineName}")
    public ResponseEntity<SuccessResponse<List<FlightsDataDTO>>> getAirlineFlights(@PathVariable String airlineName) {
        List<FlightsDataDTO> flights = flightDetailService.getFlightsByAirlineName(airlineName);
        return ResponseEntity.ok(SuccessResponse.of("Airline statistics retrieved successfully", flights));
    }



}


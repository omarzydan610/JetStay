package com.example.backend.controller.airline_stat;

import com.example.backend.service.airline_stat.AirlineStatService;
import com.example.backend.dto.AirlineDTO.AirlineStatsRequestDTO;
import com.example.backend.dto.response.SuccessResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/airline")
public class AirlineStatisticsController {

    @Autowired
    private AirlineStatService airlineStatisticsService;

    @GetMapping("/{airlineName}")
    public ResponseEntity<SuccessResponse<AirlineStatsRequestDTO>> getAirlineStatistics(@PathVariable String airlineName) {
        AirlineStatsRequestDTO stats = new AirlineStatsRequestDTO.Builder()
                .airlineName(airlineName)
                .totalFlights(airlineStatisticsService.getAirlinecount(airlineName))
                .totalRevenue(airlineStatisticsService.getAirlineRevenue(airlineName)) // placeholder
                .avgRating(airlineStatisticsService.getAirlineAvgRating(airlineName))
                .build();
        return ResponseEntity.ok(SuccessResponse.of("Airline statistics retrieved successfully", stats));
    }

}

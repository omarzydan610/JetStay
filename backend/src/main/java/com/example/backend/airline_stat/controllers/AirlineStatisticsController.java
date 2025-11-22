package com.example.backend.airline_stat.controllers;


import com.example.backend.airline_stat.service.AirlineStatService;
import com.example.backend.dto.AirlineStatsDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/airline")
public class AirlineStatisticsController {

    @Autowired
    private AirlineStatService airlineStatisticsService;

    @GetMapping("/{airlineName}")
    public AirlineStatsDTO getAirlineStatistics(@PathVariable String airlineName) {
        System.out.println("Hi!!!");

        return new AirlineStatsDTO.Builder()
                .airlineName(airlineName)
                .totalFlights(airlineStatisticsService.getAirlinecount(airlineName))
                .totalRevenue(airlineStatisticsService.getAirlineRevenue(airlineName))          // placeholder
                .avgRating(airlineStatisticsService.getAirlineAvgRating(airlineName))
                .build();
    }

}

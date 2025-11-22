package com.example.backend.airline_stat.controllers;

import com.example.backend.airline_stat.service.TripTypeStatsService;
import com.example.backend.dto.TripTypeStatsDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/airline/trip-type")
public class TripTypeStatisticsController {

    @Autowired
    private TripTypeStatsService tripTypeStatsService;

    @GetMapping("/{airlineName}")
    public TripTypeStatsDTO getTripTypes(@PathVariable(required = false) String airlineName) {
        return tripTypeStatsService.getTripTypeStats(airlineName);
    }

    @GetMapping
    public TripTypeStatsDTO getTripTypes() {
        return tripTypeStatsService.getTripTypeStats(null);
    }
}

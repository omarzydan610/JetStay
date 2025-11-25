package com.example.backend.controller.airline_stat;

import com.example.backend.service.airline_stat.TripTypeStatsService;
import com.example.backend.dto.AirlineDTO.TripTypeStatsDTO;
import com.example.backend.dto.response.SuccessResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<SuccessResponse<TripTypeStatsDTO>> getTripTypes(
            @PathVariable(required = false) String airlineName) {
        TripTypeStatsDTO data = tripTypeStatsService.getTripTypeStats(airlineName);
        return ResponseEntity.ok(SuccessResponse.of("Trip type statistics retrieved successfully", data));
    }

    @GetMapping
    public ResponseEntity<SuccessResponse<TripTypeStatsDTO>> getAllTripTypes() {
        TripTypeStatsDTO data = tripTypeStatsService.getTripTypeStats(null);
        return ResponseEntity.ok(SuccessResponse.of("Trip type statistics retrieved successfully", data));
    }
}

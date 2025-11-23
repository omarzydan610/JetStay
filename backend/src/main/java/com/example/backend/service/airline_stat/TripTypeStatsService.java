package com.example.backend.service.airline_stat;

import com.example.backend.dto.AirlineDTO.TripTypeStatsDTO;
import com.example.backend.entity.TripType.TripTypeName;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.AirlineRepository;
import com.example.backend.repository.TripTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class TripTypeStatsService {

    @Autowired
    private TripTypeRepository tripTypeRepository;

    @Autowired
    private AirlineRepository airlineRepository;

    public TripTypeStatsDTO getTripTypeStats(String airlineName) {
        validateAirlineExists(airlineName);

        List<Object[]> results;

        if (airlineName == null || airlineName.isBlank()) {
            // Calculate for all airlines
            results = tripTypeRepository.findAverageTicketsByTypeForAllAirlines();
        } else {
            // Calculate for a specific airline
            results = tripTypeRepository.findAverageTicketsByTypeForAirlineName(airlineName);
        }

        Map<TripTypeName, Double> avgMap = new HashMap<>();
        for (Object[] row : results) {
            TripTypeName typeName = (TripTypeName) row[0];
            Double avgQuantity = ((Number) row[1]).doubleValue();
            avgMap.put(typeName, avgQuantity);
        }

        // If airlineName is blank, you can set a generic name
        String name = (airlineName == null || airlineName.isBlank()) ? "All Airlines" : airlineName;
        return new TripTypeStatsDTO(name, avgMap);
    }

    private void validateAirlineExists(String airlineName) {
        if (airlineName != null && !airlineName.isBlank()) {
            Integer airlineId = airlineRepository.findAirlineIDByAirlineName(airlineName);
            if (airlineId == null) {
                throw new ResourceNotFoundException("Airline", "name", airlineName);
            }
        }
    }

}

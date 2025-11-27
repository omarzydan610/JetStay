package com.example.backend.service.airline_stat;

import com.example.backend.dto.AirlineDTO.TripTypeStatsRequestDTO;
import com.example.backend.entity.Airline;
import com.example.backend.entity.TripType.TripTypeName;
import com.example.backend.exception.UnauthorizedException;
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

    public TripTypeStatsRequestDTO getTripTypeStats(int  airlineID) {

        List<Object[]> results;

        results = tripTypeRepository.findAverageTicketsByTypeForAirlineID(airlineID);
        Airline airline = airlineRepository.findById(airlineID).orElse(null);
        if (airline == null) {
            throw new UnauthorizedException("Airline not found for the given ID: " + airlineID);
        }
        String airlineName = airline.getAirlineName();

        Map<TripTypeName, Double> avgMap = new HashMap<>();
        for (Object[] row : results) {
            TripTypeName typeName = (TripTypeName) row[0];
            Double avgQuantity = ((Number) row[1]).doubleValue();
            avgMap.put(typeName, avgQuantity);
        }

        // If airlineName is blank, you can set a generic name
        String name = airlineName;
        return new TripTypeStatsRequestDTO(name, avgMap);
    }

    public TripTypeStatsRequestDTO getTripTypeStats() {
        List<Object[]> results;

        results = tripTypeRepository.findAverageTicketsByTypeForAllAirlines();

        Map<TripTypeName, Double> avgMap = new HashMap<>();
        for (Object[] row : results) {
            TripTypeName typeName = (TripTypeName) row[0];
            Double avgQuantity = ((Number) row[1]).doubleValue();
            avgMap.put(typeName, avgQuantity);
        }

        String name = "All Airlines";
        return new TripTypeStatsRequestDTO(name, avgMap);
    }


}

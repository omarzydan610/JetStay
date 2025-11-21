package com.example.backend.airline_stat.service;


import com.example.backend.entity.TripType.TripTypeName;
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

    public Map<TripTypeName, Double> getAverageTicketsPerType(Integer airlineId) {
        List<Object[]> results = tripTypeRepository.findAverageTicketsByTypeForAirline(airlineId);
        Map<TripTypeName, Double> avgMap = new HashMap<>();
        for (Object[] row : results) {
            TripTypeName typeName = (TripTypeName) row[0];
            Double avgQuantity = (Double) row[1];
            avgMap.put(typeName, avgQuantity);
        }
        return avgMap;
    }
}

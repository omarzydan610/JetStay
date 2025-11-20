package com.example.backend.airline_stat.service;

import com.example.backend.repository.FlightRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AirlineStatisticsService {

    @Autowired
    private FlightRepository flightRepository;

//    public AirlineStatsDTO getAirlineStats(int airlineId) {
//        List<Flight> flights = flightRepository.findByAirlineId(airlineId);
//        return calculateStats(flights);
//    }
}


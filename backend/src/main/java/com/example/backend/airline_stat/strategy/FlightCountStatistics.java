package com.example.backend.airline_stat.strategy;

import com.example.backend.repository.AirlineRepository;
import com.example.backend.repository.FlightRepository;
import org.springframework.stereotype.Service;

@Service
public class FlightCountStatistics implements StatisticsStrategy {

    private final AirlineRepository airlineRepository;
    private final FlightRepository flightRepository;

    public FlightCountStatistics(AirlineRepository airlineRepository,
                                 FlightRepository flightRepository) {
        this.airlineRepository = airlineRepository;
        this.flightRepository = flightRepository;
    }

    @Override
    public Long calculate(String airlineName) {

        if (airlineName == null) return 0L;

        Integer airlineId = airlineRepository.findAirlineIDByAirlineName(airlineName);
        System.out.println(airlineId);
        if (airlineId == null) return 0L;

        int count = flightRepository.allFlightsId(airlineId).size();
        return (long) count;
    }

}

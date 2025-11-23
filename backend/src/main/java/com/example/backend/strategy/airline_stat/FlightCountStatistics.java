package com.example.backend.strategy.airline_stat;

import com.example.backend.repository.AirlineRepository;
import com.example.backend.repository.FlightRepository;
import org.springframework.stereotype.Component;

@Component
public class FlightCountStatistics implements StatisticsStrategy {

    private final AirlineRepository airlineRepository;
    private final FlightRepository flightRepository;

    public FlightCountStatistics(AirlineRepository airlineRepository,
                                 FlightRepository flightRepository) {
        this.airlineRepository = airlineRepository;
        this.flightRepository = flightRepository;
    }

    @Override
    public Double calculate(String airlineName) {
        if (airlineName == null || airlineName.isBlank()) {
            return (double) flightRepository.allFlightsIds().size();
        }

        Integer airlineId = airlineRepository.findAirlineIDByAirlineName(airlineName);
        if (airlineId == null) return 0D;

        return (double) flightRepository.allFlightsIdsByAirlineId(airlineId).size();
    }
}

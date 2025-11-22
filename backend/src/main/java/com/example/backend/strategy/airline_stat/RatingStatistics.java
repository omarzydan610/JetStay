package com.example.backend.strategy.airline_stat;

import com.example.backend.repository.AirlineRepository;
import com.example.backend.repository.FlightRepository;
import com.example.backend.repository.FlightReviewRepository;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class RatingStatistics implements StatisticsStrategy {

    private final AirlineRepository airlineRepository;
    private final FlightRepository flightRepository;
    private final FlightReviewRepository flightReviewRepository;

    public RatingStatistics(AirlineRepository airlineRepository,
                            FlightRepository flightRepository,
                            FlightReviewRepository flightReviewRepository) {
        this.airlineRepository = airlineRepository;
        this.flightRepository = flightRepository;
        this.flightReviewRepository = flightReviewRepository;
    }

    @Override
    public Double calculate(String airlineName) {
        List<Float> ratings;

        if (airlineName == null || airlineName.isBlank()) {
            ratings = flightReviewRepository.findAllRatings();
        } else {
            Integer airlineId = airlineRepository.findAirlineIDByAirlineName(airlineName);
            if (airlineId == null) return 0D;

            List<Integer> flightIds = flightRepository.allFlightsIdsByAirlineId(airlineId);
            if (flightIds.isEmpty()) return 0D;

            ratings = flightReviewRepository.findAllRatingsByFlightIds(flightIds);
        }

        return ratings.stream()
                .mapToDouble(Float::doubleValue)
                .average()
                .orElse(0.0);
    }
}

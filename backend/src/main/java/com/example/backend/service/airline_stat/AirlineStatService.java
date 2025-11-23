package com.example.backend.service.airline_stat;

import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.AirlineRepository;
import com.example.backend.strategy.airline_stat.FlightCountStatistics;
import com.example.backend.strategy.airline_stat.RatingStatistics;
import com.example.backend.strategy.airline_stat.RevenueStatistics;
import com.example.backend.strategy.airline_stat.StatisticsContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AirlineStatService {

    @Autowired
    private StatisticsContext statisticsContext;

    @Autowired
    private FlightCountStatistics flightCountStatistics;

    @Autowired
    private RevenueStatistics revenueStatistics;

    @Autowired
    private RatingStatistics ratingStatistics;

    @Autowired
    private AirlineRepository airlineRepository;

    public Double getAirlinecount(String airlineName) {
        validateAirlineExists(airlineName);
        statisticsContext.setStrategy(flightCountStatistics);
        return statisticsContext.execute(airlineName);
    }

    public Double getAirlineAvgRating(String airlineName) {
        validateAirlineExists(airlineName);
        statisticsContext.setStrategy(ratingStatistics);
        return statisticsContext.execute(airlineName);
    }

    public Double getAirlineRevenue(String airlineName) {
        validateAirlineExists(airlineName);
        statisticsContext.setStrategy(revenueStatistics);
        return statisticsContext.execute(airlineName);
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

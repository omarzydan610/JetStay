package com.example.backend.airline_stat.service;

import com.example.backend.airline_stat.strategy.FlightCountStatistics;
import com.example.backend.airline_stat.strategy.RatingStatistics;
import com.example.backend.airline_stat.strategy.RevenueStatistics;
import com.example.backend.airline_stat.strategy.StatisticsContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

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


    public Double getAirlinecount(String airlineName) {
        statisticsContext.setStrategy(flightCountStatistics);
        return statisticsContext.execute(airlineName);
    }

    public Double getAirlineAvgRating(String airlineName) {
        statisticsContext.setStrategy(ratingStatistics);
        return statisticsContext.execute(airlineName);
    }

    public Double getAirlineRevenue(String airlineName) {
        statisticsContext.setStrategy(revenueStatistics);
        return statisticsContext.execute(airlineName);
    }


}

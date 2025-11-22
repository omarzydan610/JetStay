package com.example.backend.airline_stat.service;

import com.example.backend.airline_stat.strategy.FlightCountStatistics;
import com.example.backend.airline_stat.strategy.RatingStatistics;
import com.example.backend.airline_stat.strategy.RevenueStatistics;
import com.example.backend.airline_stat.strategy.StatisticsContext;
import com.example.backend.dto.AirlineStatsDTO;
import com.example.backend.entity.Flight;
import com.example.backend.repository.AirlineRepository;
import com.example.backend.repository.FlightRepository;
import com.example.backend.repository.FlightReviewRepository;
import com.example.backend.repository.FlightTicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class AirlineStatisticsService {

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

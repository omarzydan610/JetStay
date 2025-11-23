package com.example.backend.service.airline_stat;

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

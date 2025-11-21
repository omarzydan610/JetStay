package com.example.backend.airline_stat.service;

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
    private FlightRepository flightRepository;

    @Autowired
    private FlightTicketRepository flightTicketRepository;

    @Autowired
    private FlightReviewRepository flightReviewRepository;

    @Autowired
    private AirlineRepository airlineRepository;
/*
    public AirlineStatsDTO getAirlineStats(int airlineId) {
        AirlineStatsDTO stats = new AirlineStatsDTO();
        // 1. Count flights
        long totalFlights = flightRepository.countByAirlineAirlineID(airlineId);
        stats.setTotalFlights(totalFlights);

        // 2. Calculate average rating
        Double avgRating = flightReviewRepository.averageRatingByAirlineId(airlineId);
        stats.setAverageRating(avgRating != null ? avgRating : 0.0);

        // 3. Calculate revenue from paid tickets
        BigDecimal revenue = flightTicketRepository.sumPaidTicketsRevenueByAirlineId(airlineId);
        stats.setTotalRevenue(revenue != null ? revenue : BigDecimal.ZERO);

        return stats;
    }

 */
}

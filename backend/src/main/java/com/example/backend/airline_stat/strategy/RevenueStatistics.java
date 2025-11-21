package com.example.backend.airline_stat.strategy;

import com.example.backend.entity.FlightTicket;
import com.example.backend.repository.AirlineRepository;
import com.example.backend.repository.FlightTicketRepository;

import java.util.List;

public class RevenueStatistics implements StatisticsStrategy {

    private final AirlineRepository airlineRepository;
    private final FlightTicketRepository ticketRepository;

    public RevenueStatistics(AirlineRepository airlineRepository,
                             FlightTicketRepository ticketRepository) {
        this.airlineRepository = airlineRepository;
        this.ticketRepository = ticketRepository;
    }

    @Override
    public Long calculate(String airlineName) {

        if (airlineName == null) return 0L;

        Integer airlineId = airlineRepository.findAirlineIDByAirlineName(airlineName);
        if (airlineId == null) return 0L;

        // Get all paid tickets for this airline
        List<FlightTicket> tickets = ticketRepository.findByAirlineAirlineIDAndIsPaidTrue(airlineId);

        // Sum prices
        double revenue = tickets.stream()
                .mapToDouble(FlightTicket::getPrice)
                .sum();

        return (long) revenue;
    }
}

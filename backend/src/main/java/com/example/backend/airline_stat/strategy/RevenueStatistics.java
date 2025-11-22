package com.example.backend.airline_stat.strategy;

import com.example.backend.entity.FlightTicket;
import com.example.backend.repository.AirlineRepository;
import com.example.backend.repository.FlightTicketRepository;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.List;

@Component
public class RevenueStatistics implements StatisticsStrategy {

    private final AirlineRepository airlineRepository;
    private final FlightTicketRepository ticketRepository;

    public RevenueStatistics(AirlineRepository airlineRepository,
                             FlightTicketRepository ticketRepository) {
        this.airlineRepository = airlineRepository;
        this.ticketRepository = ticketRepository;
    }

    @Override
    public Double calculate(String airlineName) {
        List<FlightTicket> tickets;

        if (airlineName == null || airlineName.isBlank()) {
            tickets = ticketRepository.findByIsPaidTrue();
        } else {
            Integer airlineId = airlineRepository.findAirlineIDByAirlineName(airlineName);
            if (airlineId == null) return 0D;

            tickets = ticketRepository.findByAirlineAirlineIDAndIsPaidTrue(airlineId);
        }

        return tickets.stream()
                .mapToDouble(FlightTicket::getPrice)
                .sum();
    }
}

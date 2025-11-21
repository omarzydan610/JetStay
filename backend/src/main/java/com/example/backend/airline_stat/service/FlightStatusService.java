package com.example.backend.airline_stat.service;

import com.example.backend.dto.FlightStatusDTO;
import com.example.backend.entity.Flight;
import com.example.backend.entity.FlightTicket;
import com.example.backend.repository.FlightRepository;
import com.example.backend.repository.FlightTicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class FlightStatusService {
    @Autowired
    private FlightTicketRepository flightTicketRepository;

    @Autowired
    private FlightRepository flightRepository;

    public Map<String, Object> getTicketsAndFlightSummary(String airlineName) {
        List<FlightTicket> tickets;

        if (airlineName == null || airlineName.isBlank()) {
            tickets = flightTicketRepository.findByIsPaidTrue();
            FlightStatusDTO summary = new FlightStatusDTO(
                    flightRepository.countByStatus(Flight.FlightStatus.PENDING),
                    flightRepository.countByStatus(Flight.FlightStatus.ON_TIME)
            );

            return Map.of("tickets", tickets, "summary", summary);
        } else {
            tickets = flightTicketRepository.findByAirlineAirlineNameAndIsPaidTrue(airlineName);
            FlightStatusDTO summary = new FlightStatusDTO(
                    flightRepository.countByAirlineAirlineNameAndStatus(airlineName, Flight.FlightStatus.PENDING),
                    flightRepository.countByAirlineAirlineNameAndStatus(airlineName, Flight.FlightStatus.ON_TIME)
            );

            return Map.of("tickets", tickets, "summary", summary);
        }
    }
}

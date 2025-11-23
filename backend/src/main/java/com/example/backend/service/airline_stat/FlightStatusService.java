package com.example.backend.service.airline_stat;

import com.example.backend.dto.AirlineDTO.FlightStatusDTO;
import com.example.backend.entity.Flight;
import com.example.backend.entity.FlightTicket;
import com.example.backend.repository.FlightRepository;
import com.example.backend.repository.FlightTicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FlightStatusService {
    @Autowired
    private FlightTicketRepository flightTicketRepository;

    @Autowired
    private FlightRepository flightRepository;

    public FlightStatusDTO getTicketsAndFlightSummary(String airlineName) {
        List<FlightTicket> tickets;
        FlightStatusDTO summary;

        if (airlineName == null || airlineName.isBlank()) {
            tickets = flightTicketRepository.findByIsPaidTrue();
            summary = new FlightStatusDTO(
                    flightRepository.countByStatus(Flight.FlightStatus.PENDING),
                    flightRepository.countByStatus(Flight.FlightStatus.ON_TIME)
            );

        } else {
            tickets = flightTicketRepository.findByAirlineAirlineNameAndIsPaidTrue(airlineName);
            summary = new FlightStatusDTO(
                    flightRepository.countByAirlineAirlineNameAndStatus(airlineName, Flight.FlightStatus.PENDING),
                    flightRepository.countByAirlineAirlineNameAndStatus(airlineName, Flight.FlightStatus.ON_TIME)
            );

        }
        return summary;
    }
}

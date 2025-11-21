package com.example.backend.airline_stat;

import com.example.backend.airline_stat.service.FlightStatusService;
import com.example.backend.dto.FlightStatusDTO;
import com.example.backend.entity.FlightTicket;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
public class TicketFlightServiceTest {

    @Autowired
    private FlightStatusService service;

    @Test
    public void testGetTicketsAndFlightSummary_AllAirlines() {
        Map<String, Object> result = service.getTicketsAndFlightSummary(null);

        List<FlightTicket> tickets = (List<FlightTicket>) result.get("tickets");
        FlightStatusDTO summary = (FlightStatusDTO) result.get("summary");

        System.out.println("Total Tickets: " + tickets.size());
        System.out.println("Pending Flights: " + summary.getPendingCount());
        System.out.println("On-Time Flights: " + summary.getOnTimeCount());

    }

    @Test
    public void testGetTicketsAndFlightSummary_SpecificAirline() {
        String airlineName = "Emirates"; // put a real airline name from your DB
        Map<String, Object> result = service.getTicketsAndFlightSummary(airlineName);

        List<FlightTicket> tickets = (List<FlightTicket>) result.get("tickets");
        FlightStatusDTO summary = (FlightStatusDTO) result.get("summary");

        System.out.println("Tickets for " + airlineName + ": " + tickets.size());
        System.out.println("Pending Flights: " + summary.getPendingCount());
        System.out.println("On-Time Flights: " + summary.getOnTimeCount());

    }
}

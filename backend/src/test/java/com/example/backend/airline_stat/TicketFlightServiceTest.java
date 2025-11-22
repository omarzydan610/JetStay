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
        FlightStatusDTO result = service.getTicketsAndFlightSummary(null);


        System.out.println("Pending Flights: " + result.getPendingCount());
        System.out.println("On-Time Flights: " + result.getOnTimeCount());

    }

    @Test
    public void testGetTicketsAndFlightSummary_SpecificAirline() {
        String airlineName = "Emirates"; // put a real airline name from your DB
        FlightStatusDTO result = service.getTicketsAndFlightSummary(airlineName);


        System.out.println("Pending Flights: " + result.getPendingCount());
        System.out.println("On-Time Flights: " + result.getOnTimeCount());

    }
}

package com.example.backend.airline_stat;

import com.example.backend.airline_stat.service.FlightStatusService;
import com.example.backend.dto.FlightStatusDTO;
import com.example.backend.entity.Airline;
import com.example.backend.entity.Airport;
import com.example.backend.entity.Flight;
import com.example.backend.entity.FlightTicket;
import com.example.backend.entity.Flight.FlightStatus;
import com.example.backend.repository.AirlineRepository;
import com.example.backend.repository.AirportRepository;
import com.example.backend.repository.FlightRepository;
import com.example.backend.repository.FlightTicketRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDate;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
public class TicketFlightServiceTest {

    @Autowired
    private FlightStatusService service;

    @Autowired
    private AirlineRepository airlineRepository;

    @Autowired
    private AirportRepository airportRepository;

    @Autowired
    private FlightRepository flightRepository;

    @Autowired
    private FlightTicketRepository flightTicketRepository;

    @BeforeEach
    void setupData() {
        flightTicketRepository.deleteAll();
        flightRepository.deleteAll();
        airlineRepository.deleteAll();
        airportRepository.deleteAll();

        // Airports
        Airport dubai = airportRepository.save(new Airport(null, "Dubai International", "Dubai", "UAE"));
        Airport cairo = airportRepository.save(new Airport(null, "Cairo International", "Cairo", "Egypt"));
        Airport doha = airportRepository.save(new Airport(null, "Hamad International", "Doha", "Qatar"));

        // Airline 1: Emirates
        Airline emirates = airlineRepository.save(
                new Airline(null, "Emirates", 4.5f, "UAE", null, "emirates.png")
        );

        Flight pendingFlight = flightRepository.save(new Flight(
                null, emirates, dubai, cairo,
                LocalDateTime.of(2025, 12, 1, 10, 0),
                LocalDateTime.of(2025, 12, 1, 12, 30),
                FlightStatus.PENDING, "DXB → CAI pending flight", "Boeing 777"
        ));

        Flight onTimeFlight = flightRepository.save(new Flight(
                null, emirates, cairo, dubai,
                LocalDateTime.of(2025, 12, 2, 14, 0),
                LocalDateTime.of(2025, 12, 2, 16, 30),
                FlightStatus.ON_TIME, "CAI → DXB on-time flight", "Airbus A380"
        ));

        flightTicketRepository.save(new FlightTicket(
                null, pendingFlight, emirates, LocalDate.of(2025, 12, 1),
                null, null, 500.0f, false
        ));
        flightTicketRepository.save(new FlightTicket(
                null, onTimeFlight, emirates, LocalDate.of(2025, 12, 2),
                null, null, 600.0f, true
        ));

        // Airline 2: Qatar Airways
        Airline qatar = airlineRepository.save(
                new Airline(null, "Qatar Airways", 4.7f, "Qatar", null, "qatar.png")
        );

        Flight qatarPendingFlight = flightRepository.save(new Flight(
                null, qatar, doha, dubai,
                LocalDateTime.of(2025, 12, 3, 9, 0),
                LocalDateTime.of(2025, 12, 3, 11, 30),
                FlightStatus.PENDING, "DOH → DXB pending flight", "Airbus A350"
        ));

        flightTicketRepository.save(new FlightTicket(
                null, qatarPendingFlight, qatar, LocalDate.of(2025, 12, 3),
                null, null, 700.0f, true
        ));
    }

    @Test
    public void testGetTicketsAndFlightSummary_AllAirlines() {
        FlightStatusDTO result = service.getTicketsAndFlightSummary(null);

        System.out.println("Pending Flights: " + result.getPendingCount());
        System.out.println("On-Time Flights: " + result.getOnTimeCount());

        assertNotNull(result);
    }

    @Test
    public void testGetTicketsAndFlightSummary_SpecificAirline() {
        String airlineName = "Emirates";
        FlightStatusDTO result = service.getTicketsAndFlightSummary(airlineName);

        System.out.println("Pending Flights: " + result.getPendingCount());
        System.out.println("On-Time Flights: " + result.getOnTimeCount());

        assertNotNull(result);
    }
}

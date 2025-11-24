package com.example.backend.service.airline_stat;


import com.example.backend.dto.AirlineDTO.FlightsDataDTO;
import com.example.backend.entity.*;
import com.example.backend.entity.Flight.FlightStatus;
import com.example.backend.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class FlightDetailServiceTest {

    @Autowired
    private FlightDetailService flightDetailService;

    @Autowired
    private AirlineRepository airlineRepository;

    @Autowired
    private FlightRepository flightRepository;

    @Autowired
    private AirportRepository airportRepository;

    @Autowired
    private UserRepository userRepository;

    @BeforeEach
    void setupData() {
        // Clear repositories
        flightRepository.deleteAll();
        airlineRepository.deleteAll();
        airportRepository.deleteAll();
        userRepository.deleteAll();

        // Create admin user
        User admin = userRepository.save(new User(null, "Admin", "One", "admin@example.com", "pass123", "1111111111",
                User.UserStatus.ACTIVE, User.UserRole.SYSTEM_ADMIN, LocalDateTime.now()));

        // Airports
        Airport dubai = airportRepository.save(new Airport(null, "Dubai International", "Dubai", "UAE"));
        Airport cairo = airportRepository.save(new Airport(null, "Cairo International", "Cairo", "Egypt"));

        // Airline
        Airline emirates = airlineRepository.save(new Airline(null, "Emirates", 4.5f, "UAE", admin, "emirates.png"));

        // Flights
        Flight flight1 = flightRepository.save(new Flight(
                null, emirates, dubai, cairo,
                LocalDateTime.of(2025, 12, 1, 10, 0),
                LocalDateTime.of(2025, 12, 1, 12, 30),
                FlightStatus.ON_TIME, "DXB → CAI", "Boeing 777"));

        Flight flight2 = flightRepository.save(new Flight(
                null, emirates, cairo, dubai,
                LocalDateTime.of(2025, 12, 2, 14, 0),
                LocalDateTime.of(2025, 12, 2, 16, 30),
                FlightStatus.PENDING, "CAI → DXB", "Airbus A350"));
    }

    @Test
    public void testGetFlightsByAirlineName_ExistingAirline() {
        List<FlightsDataDTO> flights = flightDetailService.getFlightsByAirlineName("Emirates");

        assertNotNull(flights);
        assertEquals(2, flights.size());

        FlightsDataDTO firstFlight = flights.get(0);
        assertEquals("DXB → CAI", firstFlight.getDescription());
        assertEquals("Boeing 777", firstFlight.getPlaneType());
    }

    @Test
    public void testGetFlightsByAirlineName_NonExistentAirline() {
        List<FlightsDataDTO> flights = flightDetailService.getFlightsByAirlineName("NonExistentAirline");

        assertNotNull(flights);
        assertTrue(flights.isEmpty());
    }
}


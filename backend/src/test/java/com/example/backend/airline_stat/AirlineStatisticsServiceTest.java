package com.example.backend.airline_stat;

import com.example.backend.service.airline_stat.AirlineStatService;
import com.example.backend.entity.Airline;
import com.example.backend.entity.Airport;
import com.example.backend.entity.Flight;
import com.example.backend.entity.FlightTicket;
import com.example.backend.entity.FlightReview;
import com.example.backend.entity.Flight.FlightStatus;
import com.example.backend.repository.AirlineRepository;
import com.example.backend.repository.AirportRepository;
import com.example.backend.repository.FlightRepository;
import com.example.backend.repository.FlightTicketRepository;
import com.example.backend.repository.FlightReviewRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDate;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class AirlineStatisticsServiceTest {

    @Autowired
    private AirlineStatService airlineStatisticsService;

    @Autowired
    private AirlineRepository airlineRepository;

    @Autowired
    private AirportRepository airportRepository;

    @Autowired
    private FlightRepository flightRepository;

    @Autowired
    private FlightTicketRepository flightTicketRepository;

    @Autowired
    private FlightReviewRepository flightReviewRepository;

    @BeforeEach
    void setupData() {
        flightReviewRepository.deleteAll();
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

        Flight emiratesFlight1 = flightRepository.save(new Flight(
                null, emirates, dubai, cairo,
                LocalDateTime.of(2025, 12, 1, 10, 0),
                LocalDateTime.of(2025, 12, 1, 12, 30),
                FlightStatus.ON_TIME, "DXB → CAI", "Boeing 777"
        ));

        FlightTicket emiratesTicket1 = flightTicketRepository.save(new FlightTicket(
                null, emiratesFlight1, emirates, LocalDate.of(2025, 12, 1),
                null, null, 500.0f, true
        ));

        flightReviewRepository.save(new FlightReview(
                null, 1, emiratesFlight1.getFlightId(), emiratesTicket1.getTicketId(),
                4.2f, "Smooth flight", LocalDateTime.now()
        ));

        // Airline 2: Qatar Airways
        Airline qatar = airlineRepository.save(
                new Airline(null, "Qatar Airways", 4.7f, "Qatar", null, "qatar.png")
        );

        Flight qatarFlight = flightRepository.save(new Flight(
                null, qatar, doha, dubai,
                LocalDateTime.of(2025, 12, 2, 14, 0),
                LocalDateTime.of(2025, 12, 2, 16, 30),
                FlightStatus.ON_TIME, "DOH → DXB", "Airbus A350"
        ));

        FlightTicket qatarTicket = flightTicketRepository.save(new FlightTicket(
                null, qatarFlight, qatar, LocalDate.of(2025, 12, 2),
                null, null, 800.0f, true
        ));

        flightReviewRepository.save(new FlightReview(
                null, 2, qatarFlight.getFlightId(), qatarTicket.getTicketId(),
                4.8f, "Excellent service", LocalDateTime.now()
        ));
    }

    @Test
    public void testStatisticsForSpecificAirline() {
        String airlineName = "Emirates";

        Double flightCount = airlineStatisticsService.getAirlinecount(airlineName);
        Double avgRating = airlineStatisticsService.getAirlineAvgRating(airlineName);
        Double revenue = airlineStatisticsService.getAirlineRevenue(airlineName);

        System.out.println("Flight count: " + flightCount);
        System.out.println("Average rating: " + avgRating);
        System.out.println("Revenue: " + revenue);

        assertNotNull(flightCount);
        assertNotNull(avgRating);
        assertNotNull(revenue);

        assertTrue(flightCount >= 0);
        assertTrue(avgRating >= 0 && avgRating <= 5);
        assertTrue(revenue >= 0);
    }

    @Test
    public void testStatisticsForAllAirlines() {
        Double flightCount = airlineStatisticsService.getAirlinecount(null);
        Double avgRating = airlineStatisticsService.getAirlineAvgRating(null);
        Double revenue = airlineStatisticsService.getAirlineRevenue(null);

        System.out.println("Flight count (all): " + flightCount);
        System.out.println("Average rating (all): " + avgRating);
        System.out.println("Revenue (all): " + revenue);

        assertNotNull(flightCount);
        assertNotNull(avgRating);
        assertNotNull(revenue);

        assertTrue(flightCount >= 0);
        assertTrue(avgRating >= 0 && avgRating <= 5);
        assertTrue(revenue >= 0);
    }
}

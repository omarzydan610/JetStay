package com.example.backend.airline_stat;

import com.example.backend.strategy.airline_stat.FlightCountStatistics;
import com.example.backend.strategy.airline_stat.RatingStatistics;
import com.example.backend.strategy.airline_stat.RevenueStatistics;
import com.example.backend.repository.AirlineRepository;
import com.example.backend.repository.FlightRepository;
import com.example.backend.repository.FlightReviewRepository;
import com.example.backend.repository.FlightTicketRepository;
import com.example.backend.repository.AirportRepository;
import com.example.backend.entity.Airline;
import com.example.backend.entity.Flight;
import com.example.backend.entity.Airport;
import com.example.backend.entity.FlightTicket;
import com.example.backend.entity.FlightReview;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDate;
import java.time.LocalDateTime;

@SpringBootTest
class FlightStatisticsServiceTest {

    @Autowired
    private AirlineRepository airlineRepository;

    @Autowired
    private FlightRepository flightRepository;

    @Autowired
    private FlightTicketRepository flightTicketRepository;

    @Autowired
    private FlightReviewRepository flightReviewRepository;

    @Autowired
    private AirportRepository airportRepository;

    @BeforeEach
    void setupData() {
        flightReviewRepository.deleteAll();
        flightTicketRepository.deleteAll();
        flightRepository.deleteAll();
        airlineRepository.deleteAll();
        airportRepository.deleteAll();

        // Save airports first
        Airport cairo = airportRepository.save(new Airport(null, "Cairo International", "Cairo", "Egypt"));
        Airport dubai = airportRepository.save(new Airport(null, "Dubai International", "Dubai", "UAE"));
        Airport doha = airportRepository.save(new Airport(null, "Hamad International", "Doha", "Qatar"));

        // Airline 1: EgyptAir
        Airline egyptAir = airlineRepository.save(
                new Airline(null, "EgyptAir", 4.2f, "Egypt", null, "egyptair.png")
        );

        Flight flight1 = flightRepository.save(new Flight(
                null, egyptAir, cairo, dubai,
                LocalDateTime.of(2025, 12, 1, 10, 0),
                LocalDateTime.of(2025, 12, 1, 12, 30),
                Flight.FlightStatus.ON_TIME, "CAI → DXB morning flight", "Boeing 737"
        ));

        Flight flight2 = flightRepository.save(new Flight(
                null, egyptAir, dubai, cairo,
                LocalDateTime.of(2025, 12, 2, 14, 0),
                LocalDateTime.of(2025, 12, 2, 16, 30),
                Flight.FlightStatus.ON_TIME, "DXB → CAI afternoon flight", "Airbus A320"
        ));

        FlightTicket ticket1 = flightTicketRepository.save(new FlightTicket(
                null, flight1, egyptAir, LocalDate.of(2025, 12, 1), null, null, 500.0f, true
        ));
        FlightTicket ticket2 = flightTicketRepository.save(new FlightTicket(
                null, flight2, egyptAir, LocalDate.of(2025, 12, 2), null, null, 450.0f, true
        ));

        flightReviewRepository.save(new FlightReview(
                null, 1, flight1.getFlightId(), ticket1.getTicketId(), 4.0f,
                "Good flight", LocalDateTime.now()
        ));
        flightReviewRepository.save(new FlightReview(
                null, 1, flight2.getFlightId(), ticket2.getTicketId(), 4.5f,
                "Excellent service", LocalDateTime.now()
        ));

        // Airline 2: Emirates
        Airline emirates = airlineRepository.save(
                new Airline(null, "Emirates", 4.6f, "UAE", null, "emirates.png")
        );

        Flight emiratesFlight = flightRepository.save(new Flight(
                null, emirates, dubai, doha,
                LocalDateTime.of(2025, 12, 3, 9, 0),
                LocalDateTime.of(2025, 12, 3, 11, 0),
                Flight.FlightStatus.ON_TIME, "DXB → DOH morning flight", "Boeing 777"
        ));

        FlightTicket emiratesTicket = flightTicketRepository.save(new FlightTicket(
                null, emiratesFlight, emirates, LocalDate.of(2025, 12, 3), null, null, 800.0f, true
        ));

        flightReviewRepository.save(new FlightReview(
                null, 2, emiratesFlight.getFlightId(), emiratesTicket.getTicketId(), 4.7f,
                "Outstanding service", LocalDateTime.now()
        ));
    }

    @Test
    void testFlightCount() {
        String airlineName = "EgyptAir";
        FlightCountStatistics stats = new FlightCountStatistics(airlineRepository, flightRepository);
        Double result = stats.calculate(airlineName);
        System.out.println("Total flights for " + airlineName + ": " + result);
    }

    @Test
    void testRevenue() {
        String airlineName = "EgyptAir";
        RevenueStatistics stats = new RevenueStatistics(airlineRepository, flightTicketRepository);
        Double result = stats.calculate(airlineName);
        System.out.println("Total revenue for " + airlineName + ": " + result);
    }

    @Test
    void testAvgRating() {
        String airlineName = "EgyptAir";
        RatingStatistics stats = new RatingStatistics(airlineRepository, flightRepository, flightReviewRepository);
        Double result = stats.calculate(airlineName);
        System.out.println("Avg Rating for " + airlineName + ": " + result);
    }

    @Test
    void testAllFlightCount() {
        FlightCountStatistics stats = new FlightCountStatistics(airlineRepository, flightRepository);
        Double result = stats.calculate("");
        System.out.println("Total Overall flights : " + result);
    }

    @Test
    void testAllRevenue() {
        RevenueStatistics stats = new RevenueStatistics(airlineRepository, flightTicketRepository);
        Double result = stats.calculate("");
        System.out.println("Total Overall revenue : " + result);
    }

    @Test
    void testAllAvgRating() {
        RatingStatistics stats = new RatingStatistics(airlineRepository, flightRepository, flightReviewRepository);
        Double result = stats.calculate("");
        System.out.println("Avg Overall Rating : " + result);
    }
}

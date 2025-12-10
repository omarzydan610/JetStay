package com.example.backend.service.AirlineService;

import com.example.backend.dto.AirlineDTO.FlightStatusRequestDTO;
import com.example.backend.entity.*;
import com.example.backend.exception.UnauthorizedException;
import com.example.backend.repository.*;
import com.example.backend.entity.Flight.FlightStatus;
import com.example.backend.service.AirlineService.FlightStatusService;
import com.example.backend.service.AuthService.JwtAuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.time.LocalDate;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertEquals;

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

        @Autowired
        private FlightReviewRepository flightReviewRepository;

        @Autowired
        private TripTypeRepository tripTypeRepository;

        @Autowired
        private UserRepository userRepository;

        @MockBean
        private JwtAuthService jwtAuthService;

        @BeforeEach
        void setupData() {
                // Clear repositories in dependency order
                flightReviewRepository.deleteAll();
                flightTicketRepository.deleteAll();
                tripTypeRepository.deleteAll();
                flightRepository.deleteAll();
                airlineRepository.deleteAll();
                airportRepository.deleteAll();
                userRepository.deleteAll();

                // 1. Base Users (admins + passengers)
                User admin1 = userRepository.save(new User(
                                null, "Admin", "One", "admin1@example.com", "pass123", "1111111111",
                                User.UserStatus.ACTIVE, User.UserRole.SYSTEM_ADMIN, LocalDateTime.now()));
                User admin2 = userRepository.save(new User(
                                null, "Admin", "Two", "admin2@example.com", "pass123", "2222222222",
                                User.UserStatus.ACTIVE, User.UserRole.SYSTEM_ADMIN, LocalDateTime.now()));
                User passenger1 = userRepository.save(new User(
                                null, "Ibrahim", "Client", "ibrahim@example.com", "pass123", "3333333333",
                                User.UserStatus.ACTIVE, User.UserRole.CLIENT, LocalDateTime.now()));
                User passenger2 = userRepository.save(new User(
                                null, "Sara", "Client", "sara@example.com", "pass123", "4444444444",
                                User.UserStatus.ACTIVE, User.UserRole.CLIENT, LocalDateTime.now()));

                // 2. Airports
                Airport dubai = airportRepository.save(new Airport(null, "Dubai International", "Dubai", "UAE"));
                Airport cairo = airportRepository.save(new Airport(null, "Cairo International", "Cairo", "Egypt"));
                Airport doha = airportRepository.save(new Airport(null, "Hamad International", "Doha", "Qatar"));

                // 3. Airlines (with non-null admin)
                Airline emirates = airlineRepository.save(
                                new Airline(null, "Emirates", 4.5f, "UAE", admin1, "emirates.png", 2,
                                                LocalDateTime.now(), Airline.Status.ACTIVE));
                Airline qatar = airlineRepository.save(
                                new Airline(null, "Qatar Airways", 4.7f, "Qatar", admin2, "qatar.png", 0,
                                                LocalDateTime.now(), Airline.Status.INACTIVE));

                // 4. Flights
                Flight emiratesFlight = flightRepository.save(new Flight(
                                null, emirates, dubai, cairo,
                                LocalDateTime.of(2025, 12, 1, 10, 0),
                                LocalDateTime.of(2025, 12, 1, 12, 30),
                                FlightStatus.ON_TIME, "DXB → CAI", "Boeing 777"));
                Flight qatarFlight = flightRepository.save(new Flight(
                                null, qatar, doha, dubai,
                                LocalDateTime.of(2025, 12, 2, 14, 0),
                                LocalDateTime.of(2025, 12, 2, 16, 30),
                                FlightStatus.PENDING, "DOH → DXB", "Airbus A350"));

                // 5. Trip Types
                TripType economy = tripTypeRepository.save(new TripType(null, emiratesFlight, 100, 500, "ECONOMY"));
                TripType business = tripTypeRepository.save(new TripType(null, emiratesFlight, 20, 1500, "BUSINESS"));
                TripType firstClass = tripTypeRepository.save(new TripType(null, qatarFlight, 10, 3000, "FIRST_CLASS"));

                // 6. Tickets (with non-null user + tripType)
                FlightTicket emiratesTicket1 = flightTicketRepository.save(new FlightTicket(
                                null, emiratesFlight, emirates, LocalDate.of(2025, 12, 1),
                                passenger1, economy, 500.0f, true));
                FlightTicket emiratesTicket2 = flightTicketRepository.save(new FlightTicket(
                                null, emiratesFlight, emirates, LocalDate.of(2025, 12, 1),
                                passenger2, business, 1500.0f, true));
                FlightTicket qatarTicket = flightTicketRepository.save(new FlightTicket(
                                null, qatarFlight, qatar, LocalDate.of(2025, 12, 2),
                                passenger1, firstClass, 3000.0f, true));

                // 7. Reviews (with non-null userId, flightId, ticketId)
                flightReviewRepository.save(new FlightReview(
                                null, passenger1.getUserID(), emiratesFlight.getFlightID(),
                                emiratesTicket1.getTicketId(),
                                4.2f, "Smooth flight", LocalDateTime.now()));
                flightReviewRepository.save(new FlightReview(
                                null, passenger2.getUserID(), emiratesFlight.getFlightID(),
                                emiratesTicket2.getTicketId(),
                                4.5f, "Excellent service", LocalDateTime.now()));
                flightReviewRepository.save(new FlightReview(
                                null, passenger1.getUserID(), qatarFlight.getFlightID(), qatarTicket.getTicketId(),
                                4.8f, "Outstanding experience", LocalDateTime.now()));
        }

        @Test
        public void testGetTicketsAndFlightSummary_AllAirlines() {
                FlightStatusRequestDTO result = service.getTicketsAndFlightSummary();

                System.out.println("Pending Flights: " + result.getPendingCount());
                System.out.println("On-Time Flights: " + result.getOnTimeCount());

                assertNotNull(result);
        }

        @Test
        public void testGetTicketsAndFlightSummary_SpecificAirline() {

                FlightStatusRequestDTO result = service
                                .getTicketsAndFlightSummary(airlineRepository.findAll().get(0).getAirlineID());

                System.out.println("Pending Flights: " + result.getPendingCount());
                System.out.println("On-Time Flights: " + result.getOnTimeCount());

                assertNotNull(result);
        }

        @Test
        public void testGetTicketsAndFlightSummary_NonExistentAirline_ThrowsException() {
                // Act & Assert
                UnauthorizedException exception = assertThrows(
                                UnauthorizedException.class,
                                () -> service.getTicketsAndFlightSummary(-999));
                assertEquals("Airline not found for the given ID: -999", exception.getMessage());
        }
}
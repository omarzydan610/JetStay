package com.example.backend.airline_stat;

import com.example.backend.service.airline_stat.TripTypeStatsService;
import com.example.backend.dto.TripTypeStatsDTO;
import com.example.backend.entity.Airline;
import com.example.backend.entity.Airport;
import com.example.backend.entity.Flight;
import com.example.backend.entity.FlightTicket;
import com.example.backend.entity.TripType;
import com.example.backend.entity.TripType.TripTypeName;
import com.example.backend.entity.Flight.FlightStatus;
import com.example.backend.repository.AirlineRepository;
import com.example.backend.repository.AirportRepository;
import com.example.backend.repository.FlightRepository;
import com.example.backend.repository.FlightTicketRepository;
import com.example.backend.repository.TripTypeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDate;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
public class TripTypeStatsServiceTest {

    @Autowired
    private TripTypeStatsService tripTypeStatsService;

    @Autowired
    private AirlineRepository airlineRepository;

    @Autowired
    private AirportRepository airportRepository;

    @Autowired
    private FlightRepository flightRepository;

    @Autowired
    private TripTypeRepository tripTypeRepository;

    @Autowired
    private FlightTicketRepository flightTicketRepository;

    @BeforeEach
    void setupData() {
        flightTicketRepository.deleteAll();
        tripTypeRepository.deleteAll();
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

        Flight emiratesFlight = flightRepository.save(new Flight(
                null, emirates, dubai, cairo,
                LocalDateTime.of(2025, 12, 1, 10, 0),
                LocalDateTime.of(2025, 12, 1, 12, 30),
                FlightStatus.ON_TIME, "DXB → CAI", "Boeing 777"
        ));

        TripType economy = tripTypeRepository.save(new TripType(null, emiratesFlight, 100, 500, TripTypeName.ECONOMY));
        TripType business = tripTypeRepository.save(new TripType(null, emiratesFlight, 20, 1500, TripTypeName.BUSINESS));

        flightTicketRepository.save(new FlightTicket(
                null, emiratesFlight, emirates, LocalDate.of(2025, 12, 1),
                null, economy, 500.0f, true
        ));
        flightTicketRepository.save(new FlightTicket(
                null, emiratesFlight, emirates, LocalDate.of(2025, 12, 1),
                null, business, 1500.0f, true
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

        TripType firstClass = tripTypeRepository.save(new TripType(null, qatarFlight, 10, 3000, TripTypeName.FIRST_CLASS));

        flightTicketRepository.save(new FlightTicket(
                null, qatarFlight, qatar, LocalDate.of(2025, 12, 2),
                null, firstClass, 3000.0f, true
        ));
    }

    @Test
    public void testGetAverageTicketsPerType() {
        String airlineName = "Emirates";

        TripTypeStatsDTO averages = tripTypeStatsService.getTripTypeStats(airlineName);

        System.out.println("Airline: " + averages.getAirlineName());
        System.out.println("Averages: " + averages.getAverageTicketsPerType());

        assertNotNull(averages);
    }

    @Test
    public void testGetAverageTicketsPerTypeForAll() {
        TripTypeStatsDTO averages = tripTypeStatsService.getTripTypeStats("");

        System.out.println("Airline: " + averages.getAirlineName());
        System.out.println("Averages: " + averages.getAverageTicketsPerType());

        assertNotNull(averages);
    }
}

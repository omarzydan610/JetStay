package com.example.backend.service.AirlineService;

import com.example.backend.dto.AirlineDTO.FlightDetailsDTO;
import com.example.backend.dto.AirlineDTO.FlightRequest;
import com.example.backend.entity.*;
import com.example.backend.dto.AirlineDTO.CityDtoResponse;
import com.example.backend.dto.AirlineDTO.CountryDtoResponse;
import com.example.backend.dto.AirlineDTO.FlightDetailsDTO;
import com.example.backend.dto.AirlineDTO.FlightRequest;
import com.example.backend.entity.Airline;
import com.example.backend.entity.Airport;
import com.example.backend.entity.Flight;
import com.example.backend.entity.User;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.exception.UnauthorizedException;
import com.example.backend.repository.*;
import com.example.backend.repository.AirlineRepository;
import com.example.backend.repository.AirportRepository;
import com.example.backend.repository.FlightRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.AirlineService.FlightService;
import com.example.backend.entity.*;
import com.example.backend.repository.*;
import com.example.backend.service.AuthService.JwtAuthService;

import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@SpringBootTest
@Transactional
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class FlightServiceIntegrationTestComplete {

    @Autowired
    private FlightService flightService;

    @Autowired
    private FlightRepository flightRepository;

    @Autowired
    private AirlineRepository airlineRepository;

    @Autowired
    private AirportRepository airportRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TripTypeRepository tripTypeRepository;

    @MockBean
    private JwtAuthService jwtAuthService;

    private User admin;
    private Airline airline;
    private Airport depAirport;
    private Airport arrAirport;

    @BeforeEach
    void setup() {
        flightRepository.deleteAll();
        airlineRepository.deleteAll();
        airportRepository.deleteAll();
        userRepository.deleteAll();

        // Admin user
        admin = new User();
        admin.setEmail("admin@test.com");
        admin.setPassword("pass");
        admin.setFirstName("Admin");
        admin.setLastName("User");
        admin.setPhoneNumber("01000000000");
        admin = userRepository.save(admin);

        // Airline
        airline = new Airline();
        airline.setAirlineName("Test Airline");
        airline.setAirlineNationality("Test Nationality");
        airline.setAirlineRate(4.5f);
        airline.setLogoUrl("http://testlogo.com/logo.png");

        airline.setAdmin(admin);
        airline = airlineRepository.save(airline);

        // Airports
        depAirport = new Airport();
        depAirport.setAirportName("CAI");
        depAirport.setCity("Cairo");
        depAirport.setCountry("Egypt");
        depAirport = airportRepository.save(depAirport);

        arrAirport = new Airport();
        arrAirport.setAirportName("DXB");
        arrAirport.setCity("Dubai");
        arrAirport.setCountry("UAE");
        arrAirport = airportRepository.save(arrAirport);
    }

    // ---------------------------------------------
    // 1) Add Flight
    // ---------------------------------------------
    @Test
    @Order(1)
    void testAddFlightSuccess() {
        FlightRequest req = new FlightRequest();
        req.setDepartureAirportInt(depAirport.getAirportID());
        req.setArrivalAirportInt(arrAirport.getAirportID());
        req.setDepartureDate("2025-01-10T10:00:00");
        req.setArrivalDate("2025-01-10T14:00:00");
        req.setDescription("Morning flight");
        req.setPlaneType("Boeing 777");
        req.setStatus("ON_TIME");

        flightService.addFlight(req, airline.getAirlineID());

        List<Flight> list = flightRepository.findAll();
        assertEquals(1, list.size());
        assertEquals("Boeing 777", list.get(0).getPlaneType());
    }

    // ---------------------------------------------
    // 2) Get Flight by ID success
    // ---------------------------------------------
    @Test
    @Order(2)
    void testGetFlightByIdSuccess() {
        Flight flight = new Flight(
                null,
                airline,
                depAirport,
                arrAirport,
                LocalDateTime.now(),
                LocalDateTime.now().plusHours(2),
                Flight.FlightStatus.PENDING,
                "Test flight",
                "Airbus A320");

        flight = flightRepository.save(flight);

        Flight found = flightService.getFlightById(flight.getFlightID(), airline.getAirlineID());

        assertNotNull(found);
        assertEquals("Airbus A320", found.getPlaneType());
        assertEquals(airline.getAirlineID(), found.getAirline().getAirlineID());
    }

    // ---------------------------------------------
    // 3) Get Flight unauthorized airline
    // ---------------------------------------------
    @Test
    @Order(3)
    void testGetFlightById_Unauthorized() {
        Flight flight = new Flight(
                null,
                airline,
                depAirport,
                arrAirport,
                LocalDateTime.now(),
                LocalDateTime.now().plusHours(3),
                Flight.FlightStatus.ON_TIME,
                "Test",
                "B737");

        Flight savedFlight = flightRepository.save(flight);

        assertThrows(UnauthorizedException.class,
                () -> flightService.getFlightById(savedFlight.getFlightID(), 999));
    }

    // ---------------------------------------------
    // 4) Get all flights for airline
    // ---------------------------------------------
    @Test
    @Order(4)
    void testGetAllFlightsForAirline() {
        flightRepository.save(new Flight(null, airline, depAirport, arrAirport,
                LocalDateTime.now(), LocalDateTime.now().plusHours(1),
                Flight.FlightStatus.ON_TIME, "F1", "A320"));

        flightRepository.save(new Flight(null, airline, depAirport, arrAirport,
                LocalDateTime.now(), LocalDateTime.now().plusHours(2),
                Flight.FlightStatus.ON_TIME, "F2", "A380"));

        List<Flight> list = flightService.getAllFlightForAirLine(airline.getAirlineID(), 0, 10);

        assertEquals(2, list.size());
    }

    // ---------------------------------------------
    // 5) Update flight success
    // ---------------------------------------------
    @Test
    @Order(5)
    void testUpdateFlightSuccess() {
        Flight flight = new Flight(
                null,
                airline,
                depAirport,
                arrAirport,
                LocalDateTime.parse("2025-01-01T09:00"),
                LocalDateTime.parse("2025-01-01T11:00"),
                Flight.FlightStatus.ON_TIME,
                "Old desc",
                "OldPlane");

        flight = flightRepository.save(flight);

        FlightRequest req = new FlightRequest();
        req.setDepartureAirportInt(depAirport.getAirportID());
        req.setArrivalAirportInt(arrAirport.getAirportID());
        req.setDepartureDate("2025-02-01T10:00");
        req.setArrivalDate("2025-02-01T12:00");
        req.setDescription("Updated");
        req.setPlaneType("NewPlane");

        flightService.updateFlight(flight.getFlightID(), req, airline.getAirlineID());

        Flight updated = flightRepository.findById(flight.getFlightID()).orElseThrow();

        assertEquals(LocalDateTime.parse("2025-02-01T10:00"), updated.getDepartureDate());
        assertEquals("NewPlane", updated.getPlaneType());
    }

    // ---------------------------------------------
    // 6) Update flight not found
    // ---------------------------------------------
    @Test
    @Order(6)
    void testUpdateFlightNotFound() {
        FlightRequest req = new FlightRequest();
        req.setDepartureDate("2025-05-01T09:00");

        assertThrows(ResourceNotFoundException.class,
                () -> flightService.updateFlight(99999, req, airline.getAirlineID()));
    }

    // ---------------------------------------------
    // 7) Delete flight success
    // ---------------------------------------------
    @Test
    @Order(7)
    void testDeleteFlightSuccess() {
        Flight flight = flightRepository.save(
                new Flight(null, airline, depAirport, arrAirport,
                        LocalDateTime.now(), LocalDateTime.now().plusHours(2),
                        Flight.FlightStatus.ON_TIME, "Delete test", "B787"));

        flightService.deleteFlight(flight.getFlightID(), airline.getAirlineID());

        assertFalse(flightRepository.findById(flight.getFlightID()).isPresent());
    }

    // ---------------------------------------------
    // 8) Delete flight unauthorized
    // ---------------------------------------------
    @Test
    @Order(8)
    void testDeleteFlightUnauthorized() {
        Flight flight = flightRepository.save(
                new Flight(null, airline, depAirport, arrAirport,
                        LocalDateTime.now(), LocalDateTime.now().plusHours(1),
                        Flight.FlightStatus.ON_TIME, "Desc", "Plane"));

        assertThrows(UnauthorizedException.class,
                () -> flightService.deleteFlight(flight.getFlightID(), 12345));
    }

    // ---------------------------------------------
    // 9) Add flight airport not found
    // ---------------------------------------------
    @Test
    @Order(9)
    void testAddFlight_NoAirportFound() {
        FlightRequest req = new FlightRequest();
        req.setDepartureAirportInt(111111);
        req.setArrivalAirportInt(arrAirport.getAirportID());
        req.setDepartureDate("2025-01-01T10:00");
        req.setArrivalDate("2025-01-01T12:00");

        assertThrows(ResourceNotFoundException.class,
                () -> flightService.addFlight(req, airline.getAirlineID()));
    }


    @Test
    @Order(10)
    void testGetFlightDetailsSuccess() {
        Flight flight = new Flight(
                null,
                airline,
                depAirport,
                arrAirport,
                LocalDateTime.parse("2025-03-10T08:00"),
                LocalDateTime.parse("2025-03-10T10:00"),
                Flight.FlightStatus.ON_TIME,
                "Direct Flight",
                "Boeing 777"
        );

        flight = flightRepository.save(flight);

        TripType economy = new TripType(null, flight, 100, 1500, "ECONOMY");
        tripTypeRepository.save(economy);

        List<FlightDetailsDTO> details = flightService.getFlightDetails(flight.getFlightID());

        assertNotNull(details);
        assertFalse(details.isEmpty());
        assertEquals("Boeing 777", details.get(0).getPlaneType());
        assertEquals("ECONOMY", details.get(0).getTripType());
    }


    @Test
    @Order(11)
    void testGetFlightDetailsNotFound() {
        assertThrows(ResourceNotFoundException.class,
                () -> flightService.getFlightDetails(99999));
    }

    @Test
    void getAllAirPorts_ReturnsList() {
        Airport airport = new Airport();
        airport.setAirportID(1);
        airport.setAirportName("Test Airport");
        airport.setCountry("Egypt");
        airport.setCity("Cairo");

//        when(airportRepository.findByCountryAndCity("Egypt", "Cairo"))
//                .thenReturn(List.of(airport));

        List<Airport> result = flightService.getAllAirPorts("Egypt", "Cairo");

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Cairo", result.get(0).getCity());
//        verify(airportRepository).findByCountryAndCity("Egypt", "Cairo");
    }

    @Test
    void getAllAirPorts_ReturnsEmptyList() {
//        when(airportRepository.findByCountryAndCity("USA", "Miami"))
//                .thenReturn(List.of());

        List<Airport> result = flightService.getAllAirPorts("USA", "Miami");

        assertNotNull(result);
        assertTrue(result.isEmpty());
//        verify(airportRepository).findByCountryAndCity("USA", "Miami");
    }

    @Test
    void getAllCountries_ReturnsList() {
        List<CountryDtoResponse> countries = List.of(
                new CountryDtoResponse("Egypt"),
                new CountryDtoResponse("UAE"));

//        when(airportRepository.findAllCountries()).thenReturn(countries);

        List<CountryDtoResponse> result = flightService.getAllCountries();

        assertEquals(2, result.size());
        assertEquals("Egypt", result.get(0).getName());
//        verify(airportRepository).findAllCountries();
    }

    @Test
    void getAllCountries_ReturnsEmptyList() {
//        when(airportRepository.findAllCountries()).thenReturn(List.of());
        airportRepository.deleteAll();
        List<CountryDtoResponse> result = flightService.getAllCountries();

        assertTrue(result.isEmpty());
//        verify(airportRepository).findAllCountries();
    }

    @Test
    void getCitiesByCountry_ReturnsList() {
//        List<CityDtoResponse> cities = List.of(
//                new CityDtoResponse("Cairo"),
//                new CityDtoResponse("Giza"));

//        when(airportRepository.findAllCitiesByCountry("Egypt")).thenReturn(cities);

        // Arrange
        Airport airport1 = new Airport();
        airport1.setAirportName("CAI");
        airport1.setCountry("Egypt");
        airport1.setCity("Cairo");
        airportRepository.save(airport1);

        Airport airport2 = new Airport();
        airport2.setAirportName("HBE");
        airport2.setCountry("Egypt");
        airport2.setCity("Alexandria");
        airportRepository.save(airport2);

        // Act
        List<CityDtoResponse> result = flightService.getCitiesByCountry("Egypt");

        assertEquals(2, result.size());
        assertEquals("Cairo", result.get(1).getName());
//        verify(airportRepository).findAllCitiesByCountry("Egypt");
    }

    @Test
    void getCitiesByCountry_ReturnsEmptyList() {
//        when(airportRepository.findAllCitiesByCountry("USA"))
//                .thenReturn(List.of());

        List<CityDtoResponse> result = flightService.getCitiesByCountry("USA");

        assertTrue(result.isEmpty());
//        verify(airportRepository).findAllCitiesByCountry("USA");
    }
}

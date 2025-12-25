package com.example.backend.service.AirlineService;

import com.example.backend.cache.FlightCacheManager;
import com.example.backend.dto.AirlineDTO.FlightFilterDTO;
import com.example.backend.entity.*;
import com.example.backend.exception.BadRequestException;
import com.example.backend.repository.FlightRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class FlightGraphQLServiceTest {

    private FlightCacheManager cacheManager;
    private FlightRepository flightRepository;
    private FlightGraphQLService service;

    // Base date for all tests
    private final LocalDateTime baseDate = LocalDateTime.now().plusDays(20);

    @BeforeEach
    void setup() {
        cacheManager = mock(FlightCacheManager.class);
        flightRepository = mock(FlightRepository.class);
        service = new FlightGraphQLService(cacheManager);
    }

    private Flight createFlight(
            Integer id,
            String airlineName,
            float rating,
            String nationality,
            String depAirport,
            String depCity,
            String depCountry,
            String arrAirport,
            String arrCity,
            String arrCountry,
            Flight.FlightStatus status,
            List<TripType> tripTypes
    ) {
        Airline airline = new Airline();
        airline.setAirlineName(airlineName);
        airline.setAirlineRate(rating);
        airline.setAirlineNationality(nationality);

        Airport departure = new Airport();
        departure.setAirportName(depAirport);
        departure.setCity(depCity);
        departure.setCountry(depCountry);

        Airport arrival = new Airport();
        arrival.setAirportName(arrAirport);
        arrival.setCity(arrCity);
        arrival.setCountry(arrCountry);

        // Departure and arrival relative to baseDate
        LocalDateTime depDate = baseDate.plusHours(24);
        LocalDateTime arrDate = depDate.plusHours(10);

        Flight flight = new Flight();
        flight.setFlightID(id);
        flight.setAirline(airline);
        flight.setDepartureAirport(departure);
        flight.setArrivalAirport(arrival);
        flight.setDepartureDate(depDate);
        flight.setArrivalDate(arrDate);
        flight.setStatus(status);
        flight.setTripsTypes(tripTypes);
        return flight;
    }

    @Test
    void testPaginationSinglePage() {
        Flight f1 = createFlight(1, "EgyptAir", 4.5F, "Egypt", "CAI", "Cairo", "Egypt",
                "JFK", "NY", "USA", Flight.FlightStatus.ON_TIME, List.of());

        when(cacheManager.getFlightsPage("0_10")).thenReturn(null);
        when(flightRepository.findAllAvailableFlight(PageRequest.of(0, 10)))
                .thenReturn(new PageImpl<>(List.of(f1)));

        List<Flight> result = service.filterFlights(null, flightRepository, 0, 10);

        assertEquals(1, result.size());
        verify(cacheManager).putFlightsPage("0_10", List.of(f1));
    }

    @Test
    void testPaginationFetchesNextPages() {
        Flight f1 = createFlight(1, "A", 3, "X", "A1", "C1", "P1",
                "A2", "C2", "P2", Flight.FlightStatus.ON_TIME, List.of());
        Flight f2 = createFlight(2, "B", 3, "X", "A1", "C1", "P1",
                "A2", "C2", "P2", Flight.FlightStatus.ON_TIME, List.of());

        when(cacheManager.getFlightsPage("0_1")).thenReturn(null);
        when(cacheManager.getFlightsPage("1_1")).thenReturn(null);

        when(flightRepository.findAllAvailableFlight(PageRequest.of(0, 1)))
                .thenReturn(new PageImpl<>(List.of(f1)));
        when(flightRepository.findAllAvailableFlight(PageRequest.of(1, 1)))
                .thenReturn(new PageImpl<>(List.of(f2)));

        List<Flight> result = service.filterFlights(null, flightRepository, 0, 1);

        assertEquals(1, result.size());
    }

    @Test
    void testAirlineFilters() {
        Flight f1 = createFlight(1, "EgyptAir", 4.5F, "Egypt",
                "CAI", "Cairo", "EG", "JFK", "NY", "USA",
                Flight.FlightStatus.ON_TIME, List.of());

        Flight f2 = createFlight(2, "Lufthansa", 3.0F, "Germany",
                "FRA", "Frankfurt", "DE", "DXB", "Dubai", "UAE",
                Flight.FlightStatus.ON_TIME, List.of());

        when(cacheManager.getFlightsPage("0_10")).thenReturn(null);
        when(flightRepository.findAllAvailableFlight(PageRequest.of(0, 10)))
                .thenReturn(new PageImpl<>(List.of(f1, f2)));

        FlightFilterDTO filter = new FlightFilterDTO();
        filter.setAirlineNameContains("egypt");
        filter.setAirlineRatingGte(4.0F);
        filter.setAirlineNationalityContains("egy");

        List<Flight> result = service.filterFlights(filter, flightRepository, 0, 10);

        assertEquals(1, result.size());
        assertEquals(1, result.get(0).getFlightID());
    }

    @Test
    void testAirportFilters() {
        Flight f = createFlight(1, "A", 4, "X",
                "Heathrow", "London", "UK", "JFK", "New York", "USA",
                Flight.FlightStatus.ON_TIME, List.of());

        when(cacheManager.getFlightsPage("0_10")).thenReturn(null);
        when(flightRepository.findAllAvailableFlight(PageRequest.of(0, 10)))
                .thenReturn(new PageImpl<>(List.of(f)));

        FlightFilterDTO filter = new FlightFilterDTO();
        filter.setDepartureAirportNameContains("heath");
        filter.setDepartureCityContains("lond");
        filter.setDepartureCountryContains("uk");
        filter.setArrivalAirportNameContains("jf");
        filter.setArrivalCityContains("new");
        filter.setArrivalCountryContains("usa");

        List<Flight> result = service.filterFlights(filter, flightRepository, 0, 10);

        assertEquals(1, result.size());
    }

    @Test
    void testDateFiltersInvalidFormat() {
        Flight f = createFlight(1, "A", 4, "X",
                "CAI", "Cairo", "EG", "JFK", "NY", "USA",
                Flight.FlightStatus.ON_TIME, List.of());

        when(cacheManager.getFlightsPage("0_10")).thenReturn(null);
        when(flightRepository.findAllAvailableFlight(PageRequest.of(0, 10)))
                .thenReturn(new PageImpl<>(List.of(f)));

        FlightFilterDTO filter = new FlightFilterDTO();
        filter.setDepartureDateGte("invalid-date");

        assertThrows(BadRequestException.class,
                () -> service.filterFlights(filter, flightRepository, 0, 10));
    }

    @Test
    void testTripTypeFilters() {
        TripType t1 = new TripType();
        t1.setTypeName("Economy");
        t1.setPrice(100.0F);

        TripType t2 = new TripType();
        t2.setTypeName("Business");
        t2.setPrice(500.0F);

        Flight f = createFlight(1, "A", 4, "X",
                "CAI", "Cairo", "EG", "JFK", "NY", "USA",
                Flight.FlightStatus.ON_TIME, List.of(t1, t2));

        when(cacheManager.getFlightsPage("0_10")).thenReturn(null);
        when(flightRepository.findAllAvailableFlight(PageRequest.of(0, 10)))
                .thenReturn(new PageImpl<>(List.of(f)));

        FlightFilterDTO filter = new FlightFilterDTO();
        filter.setTripTypeNameContains("eco");
        filter.setTripTypePriceGte(50.0F);
        filter.setTripTypePriceLte(150.0F);

        List<Flight> result = service.filterFlights(filter, flightRepository, 0, 10);

        assertEquals(1, result.size());
    }

    @Test
    void testStatusFilter() {
        Flight f = createFlight(1, "A", 4, "X",
                "CAI", "Cairo", "EG", "JFK", "NY", "USA",
                Flight.FlightStatus.CANCELLED, List.of());

        when(cacheManager.getFlightsPage("0_10")).thenReturn(null);
        when(flightRepository.findAllAvailableFlight(PageRequest.of(0, 10)))
                .thenReturn(new PageImpl<>(List.of(f)));

        FlightFilterDTO filter = new FlightFilterDTO();
        filter.setStatus(Flight.FlightStatus.CANCELLED);

        List<Flight> result = service.filterFlights(filter, flightRepository, 0, 10);

        assertEquals(1, result.size());
    }

    @Test
    void testEmptyDatabase() {
        when(cacheManager.getFlightsPage("0_10")).thenReturn(null);
        when(flightRepository.findAllAvailableFlight(PageRequest.of(0, 10)))
                .thenReturn(new PageImpl<>(List.of()));

        List<Flight> result = service.filterFlights(null, flightRepository, 0, 10);

        assertEquals(0, result.size());
    }
}
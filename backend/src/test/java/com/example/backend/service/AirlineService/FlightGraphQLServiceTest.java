package com.example.backend.service.AirlineService;

import com.example.backend.cache.FlightCacheManager;
import com.example.backend.dto.AirlineDTO.FlightFilterDTO;
import com.example.backend.entity.*;
import com.example.backend.exception.BadRequestException;
import com.example.backend.repository.FlightRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
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
    private TripType t1;

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
            LocalDateTime depDate,
            LocalDateTime arrDate,
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
        Flight f1 = createFlight(1, "EgyptAir", 4.5F, "Egypt", "CAI", "Cairo", "Egypt", "JFK", "NY", "USA",
                LocalDateTime.now(), LocalDateTime.now().plusHours(10), Flight.FlightStatus.ON_TIME, List.of());

        when(cacheManager.getFlightsPage("0_10")).thenReturn(null);
        when(flightRepository.findAll(PageRequest.of(0, 10)))
                .thenReturn(new PageImpl<>(List.of(f1)));

        List<Flight> result = service.filterFlights(null, flightRepository, 0, 10);

        assertEquals(1, result.size());
        verify(cacheManager).putFlightsPage("0_10", List.of(f1));
    }

    @Test
    void testPaginationFetchesNextPages() {
        Flight f1 = createFlight(1, "A", 3, "X", "A1", "C1", "P1",
                "A2", "C2", "P2", LocalDateTime.now(), LocalDateTime.now(), Flight.FlightStatus.ON_TIME, List.of());
        Flight f2 = createFlight(2, "B", 3, "X", "A1", "C1", "P1",
                "A2", "C2", "P2", LocalDateTime.now(), LocalDateTime.now(), Flight.FlightStatus.ON_TIME, List.of());

        when(cacheManager.getFlightsPage("0_1")).thenReturn(null);
        when(cacheManager.getFlightsPage("1_1")).thenReturn(null);

        when(flightRepository.findAll(PageRequest.of(0, 1)))
                .thenReturn(new PageImpl<>(List.of(f1)));
        when(flightRepository.findAll(PageRequest.of(1, 1)))
                .thenReturn(new PageImpl<>(List.of(f2)));

        List<Flight> result = service.filterFlights(null, flightRepository, 0, 1);

        assertEquals(1, result.size());
    }

    @Test
    void testAirlineFilters() {
        Flight f1 = createFlight(1, "EgyptAir", 4.5F, "Egypt",
                "CAI", "Cairo", "EG", "JFK", "NY", "USA",
                LocalDateTime.now(), LocalDateTime.now(), Flight.FlightStatus.ON_TIME, List.of());

        Flight f2 = createFlight(2, "Lufthansa", 3.0F, "Germany",
                "FRA", "Frankfurt", "DE", "DXB", "Dubai", "UAE",
                LocalDateTime.now(), LocalDateTime.now(), Flight.FlightStatus.ON_TIME, List.of());

        when(cacheManager.getFlightsPage("0_10")).thenReturn(null);
        when(flightRepository.findAll(PageRequest.of(0, 10)))
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
                "Heathrow", "London", "UK",
                "JFK", "New York", "USA",
                LocalDateTime.now(), LocalDateTime.now(), Flight.FlightStatus.ON_TIME, List.of());

        when(cacheManager.getFlightsPage("0_10")).thenReturn(null);
        when(flightRepository.findAll(PageRequest.of(0, 10)))
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
    void testDateFilters() {
        LocalDateTime dep = LocalDateTime.of(2025, 1, 1, 10, 0);
        LocalDateTime arr = LocalDateTime.of(2025, 1, 1, 15, 0);

        Flight f = createFlight(1, "A", 4, "X",
                "CAI", "Cairo", "EG",
                "JFK", "NY", "USA",
                dep, arr, Flight.FlightStatus.ON_TIME, List.of());

        when(cacheManager.getFlightsPage("0_10")).thenReturn(null);
        when(flightRepository.findAll(PageRequest.of(0, 10)))
                .thenReturn(new PageImpl<>(List.of(f)));

        FlightFilterDTO filter = new FlightFilterDTO();
        filter.setDepartureDateGte("2025-01-01T09:00:00");
        filter.setDepartureDateLte("2025-01-01T11:00:00");
        filter.setArrivalDateGte("2025-01-01T14:00:00");
        filter.setArrivalDateLte("2025-01-01T16:00:00");

        List<Flight> result = service.filterFlights(filter, flightRepository, 0, 10);

        assertEquals(1, result.size());
    }

    @Test
    void testDateFiltersInvalidFormat() {
        when(cacheManager.getFlightsPage("0_10")).thenReturn(null);
        when(flightRepository.findAll(PageRequest.of(0, 10)))
                .thenReturn(new PageImpl<>(List.of(
                        createFlight(1, "A", 4, "X", "CAI", "Cairo", "EG", "JFK", "NY", "USA",
                                LocalDateTime.now(), LocalDateTime.now(), Flight.FlightStatus.ON_TIME, List.of())
                )));

        FlightFilterDTO filter = new FlightFilterDTO();
        filter.setDepartureDateGte("invalid-date");

        assertThrows(BadRequestException.class,
                () -> service.filterFlights(filter, flightRepository, 0, 10));
    }

    @Test
    void testTripTypeFilters() {
        TripType t1 = new TripType();
        t1.setTypeName("Economy");
        t1.setPrice((float) 100.0);

        TripType t2 = new TripType();
        t2.setTypeName("Business");
        t2.setPrice((float) 500.0);

        Flight f = createFlight(1, "A", 4, "X",
                "CAI", "Cairo", "EG",
                "JFK", "NY", "USA",
                LocalDateTime.now(), LocalDateTime.now(),
                Flight.FlightStatus.ON_TIME, List.of(t1, t2));

        when(cacheManager.getFlightsPage("0_10")).thenReturn(null);
        when(flightRepository.findAll(PageRequest.of(0, 10)))
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
        Flight f = createFlight(1, "A", 4, "X", "CAI", "Cairo", "EG", "JFK", "NY", "USA",
                LocalDateTime.now(), LocalDateTime.now(), Flight.FlightStatus.CANCELLED, List.of());

        when(cacheManager.getFlightsPage("0_10")).thenReturn(null);
        when(flightRepository.findAll(PageRequest.of(0, 10)))
                .thenReturn(new PageImpl<>(List.of(f)));

        FlightFilterDTO filter = new FlightFilterDTO();
        filter.setStatus(Flight.FlightStatus.CANCELLED);

        List<Flight> result = service.filterFlights(filter, flightRepository, 0, 10);

        assertEquals(1, result.size());
    }

    @Test
    void testEmptyDatabase() {
        when(cacheManager.getFlightsPage("0_10")).thenReturn(null);
        when(flightRepository.findAll(PageRequest.of(0, 10)))
                .thenReturn(new PageImpl<>(List.of()));

        List<Flight> result = service.filterFlights(null, flightRepository, 0, 10);

        assertEquals(0, result.size());
    }
}
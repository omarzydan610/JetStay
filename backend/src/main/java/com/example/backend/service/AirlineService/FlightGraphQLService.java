package com.example.backend.service.AirlineService;

import com.example.backend.cache.FlightCacheManager;
import com.example.backend.dto.AirlineDTO.FlightFilterDTO;
import com.example.backend.entity.Flight;
import com.example.backend.exception.BadRequestException;
import com.example.backend.repository.FlightRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;

@Service
public class FlightGraphQLService {

    private final FlightCacheManager cacheManager;

    public FlightGraphQLService(FlightCacheManager cacheManager) {
        this.cacheManager = cacheManager;
    }

    public List<Flight> filterFlights(FlightFilterDTO filter, FlightRepository flightRepository, int page, int size) {
        List<Flight> result = new ArrayList<>();
        int currentPage = page;

        while (result.size() < size) {
            List<Flight> pageFlights = getFlightsPaginated(flightRepository, currentPage, size);
            if (pageFlights.isEmpty()) break; // no more flights in database

            List<Flight> filteredPage = pageFlights.stream()
                    // Airline filters
                    .filter(f -> filter == null || filter.getAirlineNameContains() == null ||
                            f.getAirline().getAirlineName().toLowerCase()
                                    .contains(filter.getAirlineNameContains().toLowerCase()))
                    .filter(f -> filter == null || filter.getAirlineRatingGte() == null ||
                            f.getAirline().getAirlineRate() >= filter.getAirlineRatingGte())
                    .filter(f -> filter == null || filter.getAirlineRatingLte() == null ||
                            f.getAirline().getAirlineRate() <= filter.getAirlineRatingLte())
                    .filter(f -> filter == null || filter.getAirlineNationalityContains() == null ||
                            f.getAirline().getAirlineNationality().toLowerCase()
                                    .contains(filter.getAirlineNationalityContains().toLowerCase()))

                    // Departure airport filters
                    .filter(f -> filter == null || filter.getDepartureAirportNameContains() == null ||
                            f.getDepartureAirport().getAirportName().toLowerCase()
                                    .contains(filter.getDepartureAirportNameContains().toLowerCase()))
                    .filter(f -> filter == null || filter.getDepartureCityContains() == null ||
                            f.getDepartureAirport().getCity().toLowerCase()
                                    .contains(filter.getDepartureCityContains().toLowerCase()))
                    .filter(f -> filter == null || filter.getDepartureCountryContains() == null ||
                            f.getDepartureAirport().getCountry().toLowerCase()
                                    .contains(filter.getDepartureCountryContains().toLowerCase()))

                    // Arrival airport filters
                    .filter(f -> filter == null || filter.getArrivalAirportNameContains() == null ||
                            f.getArrivalAirport().getAirportName().toLowerCase()
                                    .contains(filter.getArrivalAirportNameContains().toLowerCase()))
                    .filter(f -> filter == null || filter.getArrivalCityContains() == null ||
                            f.getArrivalAirport().getCity().toLowerCase()
                                    .contains(filter.getArrivalCityContains().toLowerCase()))
                    .filter(f -> filter == null || filter.getArrivalCountryContains() == null ||
                            f.getArrivalAirport().getCountry().toLowerCase()
                                    .contains(filter.getArrivalCountryContains().toLowerCase()))

                    // Flight status
                    .filter(f -> filter == null || filter.getStatus() == null || f.getStatus() == filter.getStatus())

                    // Departure date filters
                    .filter(f -> {
                        if (filter == null || filter.getDepartureDateGte() == null) return true;
                        try {
                            return f.getDepartureDate().isAfter(LocalDateTime.parse(filter.getDepartureDateGte()).minusSeconds(1));
                        } catch (DateTimeParseException e) {
                            throw new BadRequestException("Invalid departureDateGte format");
                        }
                    })
                    .filter(f -> {
                        if (filter == null || filter.getDepartureDateLte() == null) return true;
                        try {
                            return f.getDepartureDate().isBefore(LocalDateTime.parse(filter.getDepartureDateLte()).plusSeconds(1));
                        } catch (DateTimeParseException e) {
                            throw new BadRequestException("Invalid departureDateLte format");
                        }
                    })

                    // Arrival date filters
                    .filter(f -> {
                        if (filter == null || filter.getArrivalDateGte() == null) return true;
                        try {
                            return f.getArrivalDate().isAfter(LocalDateTime.parse(filter.getArrivalDateGte()).minusSeconds(1));
                        } catch (DateTimeParseException e) {
                            throw new BadRequestException("Invalid arrivalDateGte format");
                        }
                    })
                    .filter(f -> {
                        if (filter == null || filter.getArrivalDateLte() == null) return true;
                        try {
                            return f.getArrivalDate().isBefore(LocalDateTime.parse(filter.getArrivalDateLte()).plusSeconds(1));
                        } catch (DateTimeParseException e) {
                            throw new BadRequestException("Invalid arrivalDateLte format");
                        }
                    })

                    // TripType filters
                    .filter(f -> {
                        if (filter == null ||
                                (filter.getTripTypeNameContains() == null &&
                                        filter.getTripTypePriceGte() == null &&
                                        filter.getTripTypePriceLte() == null))
                            return true;

                        if (f.getTripsTypes() == null || f.getTripsTypes().isEmpty()) return false;

                        return f.getTripsTypes().stream().anyMatch(t ->
                                (filter.getTripTypeNameContains() == null ||
                                        t.getTypeName().toLowerCase()
                                                .contains(filter.getTripTypeNameContains().toLowerCase()))
                                        && (filter.getTripTypePriceGte() == null || t.getPrice() >= filter.getTripTypePriceGte())
                                        && (filter.getTripTypePriceLte() == null || t.getPrice() <= filter.getTripTypePriceLte())
                        );
                    })
                    .toList();

            result.addAll(filteredPage);

            if (pageFlights.size() < size) break; // reached the last page
            currentPage++;
        }

        return result.size() > size ? result.subList(0, size) : result;
    }

    public List<Flight> getFlightsPaginated(FlightRepository flightRepository, int page, int size) {
        String pageKey = page + "_" + size;
        List<Flight> cachedPage = cacheManager.getFlightsPage(pageKey);
        if (cachedPage != null) return cachedPage;

        Pageable pageable = PageRequest.of(page, size);
        List<Flight> pageFlights = flightRepository.findAll(pageable).getContent();

        for (Flight flight : pageFlights) {
            cacheManager.putFlightById(flight.getFlightID(), flight);
        }

        cacheManager.putFlightsPage(pageKey, pageFlights);
        return pageFlights;
    }
}
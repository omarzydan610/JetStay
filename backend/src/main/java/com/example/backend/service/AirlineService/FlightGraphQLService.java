package com.example.backend.service.AirlineService;

import com.example.backend.dto.AirlineDTO.FlightFilterDTO;
import com.example.backend.entity.Flight;
import com.example.backend.exception.BadRequestException;
import com.example.backend.repository.FlightRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.List;

@Service
public class FlightGraphQLService {

    public List<Flight> filterFlights(FlightFilterDTO filter, FlightRepository flightRepository, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        List<Flight> pageFlights = flightRepository.findAll(pageable).getContent();

        System.out.println("Page: "+ page+ "Size: "+ size);
        if (filter == null) return pageFlights;

        return pageFlights.stream()
                // Airline filters
                .filter(f -> filter.getAirlineNameContains() == null ||
                        f.getAirline().getAirlineName().toLowerCase()
                                .contains(filter.getAirlineNameContains().toLowerCase()))
                .filter(f -> filter.getAirlineRatingGte() == null ||
                        f.getAirline().getAirlineRate() >= filter.getAirlineRatingGte())
                .filter(f -> filter.getAirlineRatingLte() == null ||
                        f.getAirline().getAirlineRate() <= filter.getAirlineRatingLte())
                .filter(f -> filter.getAirlineNationalityContains() == null ||
                        f.getAirline().getAirlineNationality().toLowerCase()
                                .contains(filter.getAirlineNationalityContains().toLowerCase()))

                // Departure airport filters
                .filter(f -> filter.getDepartureAirportNameContains() == null ||
                        f.getDepartureAirport().getAirportName().toLowerCase()
                                .contains(filter.getDepartureAirportNameContains().toLowerCase()))
                .filter(f -> filter.getDepartureCityContains() == null ||
                        f.getDepartureAirport().getCity().toLowerCase()
                                .contains(filter.getDepartureCityContains().toLowerCase()))
                .filter(f -> filter.getDepartureCountryContains() == null ||
                        f.getDepartureAirport().getCountry().toLowerCase()
                                .contains(filter.getDepartureCountryContains().toLowerCase()))

                // Arrival airport filters
                .filter(f -> filter.getArrivalAirportNameContains() == null ||
                        f.getArrivalAirport().getAirportName().toLowerCase()
                                .contains(filter.getArrivalAirportNameContains().toLowerCase()))
                .filter(f -> filter.getArrivalCityContains() == null ||
                        f.getArrivalAirport().getCity().toLowerCase()
                                .contains(filter.getArrivalCityContains().toLowerCase()))
                .filter(f -> filter.getArrivalCountryContains() == null ||
                        f.getArrivalAirport().getCountry().toLowerCase()
                                .contains(filter.getArrivalCountryContains().toLowerCase()))

                // Flight status
                .filter(f -> filter.getStatus() == null || f.getStatus() == filter.getStatus())

                // Departure date filters
                .filter(f -> {
                    if (filter.getDepartureDateGte() == null) return true;
                    try {
                        return f.getDepartureDate().isAfter(LocalDateTime.parse(filter.getDepartureDateGte()).minusSeconds(1));
                    } catch (DateTimeParseException e) {
                        throw new BadRequestException("Invalid departureDateGte format");
                    }
                })
                .filter(f -> {
                    if (filter.getDepartureDateLte() == null) return true;
                    try {
                        return f.getDepartureDate().isBefore(LocalDateTime.parse(filter.getDepartureDateLte()).plusSeconds(1));
                    } catch (DateTimeParseException e) {
                        throw new BadRequestException("Invalid departureDateLte format");
                    }
                })

                // Arrival date filters
                .filter(f -> {
                    if (filter.getArrivalDateGte() == null) return true;
                    try {
                        return f.getArrivalDate().isAfter(LocalDateTime.parse(filter.getArrivalDateGte()).minusSeconds(1));
                    } catch (DateTimeParseException e) {
                        throw new BadRequestException("Invalid departureDateGte format");
                    }
                })
                .filter(f -> {
                    if (filter.getArrivalDateLte() == null) return true;
                    try {
                        return f.getArrivalDate().isBefore(LocalDateTime.parse(filter.getArrivalDateLte()).plusSeconds(1));
                    } catch (DateTimeParseException e) {
                        throw new BadRequestException("Invalid arrivalDateLte format");
                    }
                })

                // TripType filters
                .filter(f -> {
                    if ((filter.getTripTypeNameContains() == null) &&
                            (filter.getTripTypePriceGte() == null) &&
                            (filter.getTripTypePriceLte() == null))
                        return true;

                    if (f.getTripsTypes() == null || f.getTripsTypes().isEmpty()) return false;

                    return f.getTripsTypes().stream().anyMatch(t ->
                            (filter.getTripTypeNameContains() == null ||
                                    t.getTypeName().toLowerCase()
                                            .contains(filter.getTripTypeNameContains().toLowerCase()))
                                    &&
                                    (filter.getTripTypePriceGte() == null || t.getPrice() >= filter.getTripTypePriceGte())
                                    &&
                                    (filter.getTripTypePriceLte() == null || t.getPrice() <= filter.getTripTypePriceLte())
                    );
                })
                .toList();
    }
}
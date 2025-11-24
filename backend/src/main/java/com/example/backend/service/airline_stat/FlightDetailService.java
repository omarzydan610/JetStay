package com.example.backend.service.airline_stat;

import com.example.backend.dto.AirlineDTO.FlightsDataDTO;
import com.example.backend.entity.Airline;
import com.example.backend.entity.Flight;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.AirlineRepository;
import com.example.backend.repository.FlightRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FlightDetailService {

    private final FlightRepository flightRepository;
    private final AirlineRepository airlineRepository;

    public FlightDetailService(FlightRepository flightRepository, AirlineRepository airlineRepository) {
        this.flightRepository = flightRepository;
        this.airlineRepository = airlineRepository;
    }

    public List<FlightsDataDTO> getFlightsByAirlineName(String airlineName) {
        validateAirlineExists(airlineName);
        Airline airline = airlineRepository.findByAirlineName(airlineName);


        if (airline == null) {
            return List.of();
        }

        List<Flight> flights = flightRepository.findByAirline_AirlineID(airline.getAirlineID());

        return flights.stream()
                .map(flight -> new FlightsDataDTO.Builder()
                        .flightId(flight.getFlightID())
                        .airlineId(flight.getAirline().getAirlineID())
                        .departureAirport(flight.getDepartureAirport().getAirportName())
                        .arrivalAirport(flight.getArrivalAirport().getAirportName())
                        .departureDate(flight.getDepartureDate())
                        .arrivalDate(flight.getArrivalDate())
                        .status(flight.getStatus().name())
                        .description(flight.getDescription())
                        .planeType(flight.getPlaneType())
                        .build()
                )
                .collect(Collectors.toList());

    }

    private void validateAirlineExists(String airlineName) {
        if (airlineName != null && !airlineName.isBlank()) {
            Integer airlineId = airlineRepository.findAirlineIDByAirlineName(airlineName);
            if (airlineId == null) {
                throw new ResourceNotFoundException("Airline", "name", airlineName);
            }
        }
    }
}

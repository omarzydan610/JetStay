package com.example.backend.service.FlightService;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.example.backend.dto.FlightDTO.FlightRequest;
import com.example.backend.entity.Airline;
import com.example.backend.entity.Airport;
import com.example.backend.entity.Flight;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.exception.UnauthorizedException;
import com.example.backend.repository.AirlineRepository;
import com.example.backend.repository.AirportRepository;
import com.example.backend.repository.FlightRepository;

@Service
public class FlightService {
    @Autowired
    public FlightRepository flightRepository;

    @Autowired
    public AirlineRepository airlineRepository;

    @Autowired
    private AirportRepository airportRepository;

    public Flight getFlightById(int id, int airlineID) {
        Flight flight = flightRepository.findById(id).orElse(null);
        if (flight == null) {
            throw new ResourceNotFoundException("Flight not found with id: " + id);
        }
        if (flight.getAirline().getAirlineID() != airlineID) {
            throw new UnauthorizedException("Flight not found with id: " + id + " for the given airline");
        }
        return flight;
    }

    public Flight addFlight(FlightRequest flight, int airlineID) {
        Flight newFlight = new Flight();
        Airline airline = airlineRepository.findById(airlineID).orElse(null);
        Airport departureAirport = airportRepository.findById(flight.getDepartureAirportInt()).orElse(null);
        Airport arrivalAirport = airportRepository.findById(flight.getArrivalAirportInt()).orElse(null);
        if (airline == null) {
            throw new UnauthorizedException("Airline not found with id: " + airlineID);
        }
        if (departureAirport == null) {
            throw new ResourceNotFoundException(
                    "Departure Airport not found with id: " + flight.getDepartureAirportInt());
        }
        if (arrivalAirport == null) {
            throw new ResourceNotFoundException(
                    "Arrival Airport not found with id: " + flight.getArrivalAirportInt());
        }
        newFlight.setDepartureAirport(departureAirport);
        newFlight.setArrivalAirport(arrivalAirport);
        newFlight.setDescription(flight.getDescription());
        newFlight.setPlaneType(flight.getPlaneType());
        newFlight.setAirline(airline);
        newFlight.setDepartureDate(LocalDateTime.parse(flight.getDepartureDate()));
        newFlight.setArrivalDate(LocalDateTime.parse(flight.getArrivalDate()));
        if (flight.getStatus() == "PENDING") {
            newFlight.setStatus(Flight.FlightStatus.PENDING);
        } else if (flight.getStatus() == "CANCELLED") {
            newFlight.setStatus(Flight.FlightStatus.CANCELLED);
        } else {
            newFlight.setStatus(Flight.FlightStatus.ON_TIME);
        }
        flightRepository.save(newFlight);
        return flightRepository.save(newFlight);
    }

    public Void deleteFlight(int id, int airlineID) {
        Flight flight = flightRepository.findById(id).orElse(null);
        if (flight == null) {
            throw new ResourceNotFoundException("Flight not found with id: " + id);
        }
        if (flight.getAirline().getAirlineID() != airlineID) {
            throw new UnauthorizedException("Flight not found with id: " + id + " for the given airline");
        }
        flightRepository.delete(flight);
        return null;
    }

    public Void updateFlight(int flightID, FlightRequest updatedFlight, int airlineID) {
        Flight existingFlight = flightRepository.findById(flightID).orElse(null);
        if (existingFlight == null) {
            throw new ResourceNotFoundException("Flight not found with id: " + flightID);
        }
        if (existingFlight.getAirline().getAirlineID() != airlineID) {
            throw new UnauthorizedException("Flight not found with id: " + flightID + " for the given airline");
        }
        LocalDateTime departureDate = LocalDateTime.parse(updatedFlight.getDepartureDate());
        LocalDateTime arrivalDate = LocalDateTime.parse(updatedFlight.getArrivalDate());
        Airport departureAirport = airportRepository.findById(updatedFlight.getDepartureAirportInt()).orElse(null);
        Airport arrivalAirport = airportRepository.findById(updatedFlight.getArrivalAirportInt()).orElse(null);
        if (departureAirport == null) {
            throw new ResourceNotFoundException(
                    "Departure Airport not found with id: " + updatedFlight.getDepartureAirportInt());
        }
        if (arrivalAirport == null) {
            throw new ResourceNotFoundException(
                    "Arrival Airport not found with id: " + updatedFlight.getArrivalAirportInt());
        }
        existingFlight.setDepartureDate(departureDate);
        existingFlight.setArrivalDate(arrivalDate);
        existingFlight
                .setDepartureAirport(departureAirport);
        existingFlight.setArrivalAirport(arrivalAirport);
        existingFlight.setDescription(updatedFlight.getDescription());
        existingFlight.setPlaneType(updatedFlight.getPlaneType());
        if (updatedFlight.getStatus() == "PENDING") {
            existingFlight.setStatus(Flight.FlightStatus.PENDING);
        } else if (updatedFlight.getStatus() == "CANCELLED") {
            existingFlight.setStatus(Flight.FlightStatus.CANCELLED);
        } else {
            existingFlight.setStatus(Flight.FlightStatus.ON_TIME);
        }
        flightRepository.save(existingFlight);
        return null;
    }

    public List<Flight> getAllFlightForAirLine(int airlineID, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size);
        return flightRepository.findByAirlineAirlineID(airlineID, pageRequest);
    }

}

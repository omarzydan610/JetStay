package com.example.backend.service.AirlineService;

import java.time.LocalDateTime;
import java.util.List;

import com.example.backend.cache.FlightCacheManager;
import com.example.backend.dto.AirlineDTO.FlightDetailsDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.example.backend.dto.AirlineDTO.CityDtoResponse;
import com.example.backend.dto.AirlineDTO.CountryDtoResponse;
import com.example.backend.dto.AirlineDTO.FlightRequest;
import com.example.backend.dto.AirlineDTO.TicketTypeDTO;
import com.example.backend.entity.Airline;
import com.example.backend.entity.Airport;
import com.example.backend.entity.Flight;
import com.example.backend.entity.TripType;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.exception.UnauthorizedException;
import com.example.backend.repository.AirlineRepository;
import com.example.backend.repository.AirportRepository;
import com.example.backend.repository.FlightRepository;
import com.example.backend.repository.TripTypeRepository;

@Service
public class FlightService {
    @Autowired
    public FlightRepository flightRepository;

    @Autowired
    public AirlineRepository airlineRepository;

    @Autowired
    private AirportRepository airportRepository;

    @Autowired
    private TripTypeRepository tripTypeRepository;

    @Autowired
    private FlightCacheManager flightCacheManager;

    public Flight getFlightById(int id, int airlineID) {
        Flight flight;
        flight = flightCacheManager.getFlightById(id);
        if (flight != null) return flight;
        flight = flightRepository.findById(id).orElse(null);
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
        Flight savedFlight = flightRepository.save(newFlight);

        // Save ticket types
        if (flight.getTicketTypes() != null && !flight.getTicketTypes().isEmpty()) {
            for (TicketTypeDTO ticketTypeDTO : flight.getTicketTypes()) {
                TripType tripType = new TripType();
                tripType.setFlight(savedFlight);
                tripType.setTypeName(ticketTypeDTO.getTypeName().toLowerCase());
                tripType.setPrice(ticketTypeDTO.getPrice().intValue());
                tripType.setQuantity(ticketTypeDTO.getQuantity());
                tripTypeRepository.save(tripType);
            }
        }

        return savedFlight;
    }

    public Void deleteFlight(int id, int airlineID) {
        flightCacheManager.evictFlightCompletely(id);
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
        flightCacheManager.evictFlightById(flightID);
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
        if ("PENDING".equals(updatedFlight.getStatus())) {
            existingFlight.setStatus(Flight.FlightStatus.PENDING);
        } else if ("CANCELLED".equals(updatedFlight.getStatus())) {
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

    public List<FlightDetailsDTO> getFlightDetails(int flightID) {
        if (!flightRepository.existsById(flightID)) {
            throw new ResourceNotFoundException("Flight not found with id: " + flightID);
        }
        return flightRepository.getFlightDetails(flightID);
    }

    public List<Airport> getAllAirPorts(String country, String city) {
        return airportRepository.findByCountryAndCity(country, city);
    }

    public List<CountryDtoResponse> getAllCountries() {
        return airportRepository.findAllCountries();
    }

    public List<CityDtoResponse> getCitiesByCountry(String countryName) {
        return airportRepository.findAllCitiesByCountry(countryName);
    }

    public List<String> getTicketTypes() {
        return tripTypeRepository.findAllDistinctTicketTypes();
    }
}

package com.example.backend.service.AirlineService;

import com.example.backend.dto.AirlineDTO.FlightStatusRequestDTO;
import com.example.backend.entity.Airline;
import com.example.backend.entity.Flight;
import com.example.backend.exception.UnauthorizedException;
import com.example.backend.repository.AirlineRepository;
import com.example.backend.repository.FlightRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FlightStatusService {
    @Autowired
    private FlightRepository flightRepository;

    @Autowired
    private AirlineRepository airlineRepository;

    public FlightStatusRequestDTO getTicketsAndFlightSummary(int airlineID) {
        FlightStatusRequestDTO summary;
        Airline airline = airlineRepository.findById(airlineID).orElse(null);
        if (airline == null) {
            throw new UnauthorizedException("Airline not found for the given ID: " + airlineID);
        }
        summary = new FlightStatusRequestDTO(
                flightRepository.countByAirlineAirlineIDAndStatus(airlineID, Flight.FlightStatus.PENDING),
                flightRepository.countByAirlineAirlineIDAndStatus(airlineID, Flight.FlightStatus.ON_TIME));
        return summary;
    }

    public FlightStatusRequestDTO getTicketsAndFlightSummary() {
        FlightStatusRequestDTO summary = new FlightStatusRequestDTO(
                flightRepository.countByStatus(Flight.FlightStatus.PENDING),
                flightRepository.countByStatus(Flight.FlightStatus.ON_TIME));
        return summary;
    }

}

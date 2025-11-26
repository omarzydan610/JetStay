package com.example.backend.service.airline_stat;

import com.example.backend.dto.AirlineDTO.FlightStatusRequestDTO;
import com.example.backend.entity.Flight;
import com.example.backend.exception.ResourceNotFoundException;
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

    public FlightStatusRequestDTO getTicketsAndFlightSummary(String airlineName) {
        validateAirlineExists(airlineName);

        FlightStatusRequestDTO summary;

        if (airlineName == null || airlineName.isBlank()) {
            summary = new FlightStatusRequestDTO(
                    flightRepository.countByStatus(Flight.FlightStatus.PENDING),
                    flightRepository.countByStatus(Flight.FlightStatus.ON_TIME));

        } else {
            summary = new FlightStatusRequestDTO(
                    flightRepository.countByAirlineAirlineNameAndStatus(airlineName, Flight.FlightStatus.PENDING),
                    flightRepository.countByAirlineAirlineNameAndStatus(airlineName, Flight.FlightStatus.ON_TIME));

        }
        return summary;
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

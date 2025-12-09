package com.example.backend.controller.AirlineController;

import com.example.backend.dto.AirlineDTO.FlightFilterDTO;
import com.example.backend.entity.Flight;
import com.example.backend.repository.FlightRepository;
import com.example.backend.service.AirlineService.FlightGraphQLService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
public class FlightGraphQLController {

    @Autowired
    private final FlightRepository flightRepository;

    @Autowired
    private final FlightGraphQLService flightGraphQLService;

    public FlightGraphQLController(FlightRepository flightRepository, FlightGraphQLService flightGraphQLService) {
        this.flightRepository = flightRepository;
        this.flightGraphQLService = flightGraphQLService;
    }

    @QueryMapping
    public List<Flight> flights(@Argument FlightFilterDTO filter,
                                @Argument int page,
                                @Argument int size) {
        return flightGraphQLService.filterFlights(filter, flightRepository, page, size);
    }

}
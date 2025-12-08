package com.example.backend.resolver;

import com.coxautodev.graphql.tools.GraphQLQueryResolver;
import com.example.backend.dto.AirlineDTO.AirlineFilterDTO;
import com.example.backend.entity.Airline;
import com.example.backend.repository.AirlineRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class AirlineResolver implements GraphQLQueryResolver {

    private final AirlineRepository airlineRepository;

    public AirlineResolver(AirlineRepository airlineRepository) {
        this.airlineRepository = airlineRepository;
    }

    public List<Airline> airlines(AirlineFilterDTO filter) {
        return airlineRepository.findAll().stream()
                .filter(a -> filter == null || (
                        (filter.getRatingGte() == null || a.getRating() >= filter.getRatingGte()) &&
                                (filter.getRatingLte() == null || a.getRating() <= filter.getRatingLte()) &&
                                (filter.getAirlineNationality() == null || a.getAirlineNationality().equalsIgnoreCase(filter.getAirlineNationality())) &&
                                (filter.getNameContains() == null || a.getName().toLowerCase().contains(filter.getNameContains().toLowerCase()))
                ))
                .collect(Collectors.toList());
    }
}

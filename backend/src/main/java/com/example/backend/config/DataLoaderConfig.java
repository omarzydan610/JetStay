package com.example.backend.config;

import com.example.backend.entity.Airline;
import com.example.backend.entity.Airport;
import com.example.backend.entity.TripType;
import com.example.backend.repository.AirlineRepository;
import com.example.backend.repository.AirportRepository;
import com.example.backend.repository.TripTypeRepository;
import org.springframework.context.annotation.Configuration;
import org.springframework.graphql.execution.BatchLoaderRegistry;
import reactor.core.publisher.Mono;

import java.util.stream.Collectors;

@Configuration
public class DataLoaderConfig {
    public DataLoaderConfig(BatchLoaderRegistry registry,
                            AirlineRepository airlineRepo,
                            AirportRepository airportRepo,
                            TripTypeRepository tripTypeRepo) {

        registry
                .forTypePair(Integer.class, Airline.class)
                .registerMappedBatchLoader((ids, env) ->
                        Mono.fromSupplier(() ->
                                airlineRepo.findAllById(ids)
                                        .stream()
                                        .collect(Collectors.toMap(Airline::getAirlineID, a -> a))
                        )
                );

        registry
                .forTypePair(Integer.class, Airport.class)
                .registerMappedBatchLoader((ids, env) ->
                        Mono.fromSupplier(() ->
                                airportRepo.findAllById(ids)
                                        .stream()
                                        .collect(Collectors.toMap(Airport::getAirportID, a -> a))
                        )
                );

        registry
                .forTypePair(Integer.class, TripType.class)
                .registerMappedBatchLoader((ids, env) ->
                        Mono.fromSupplier(() ->
                                tripTypeRepo.findAllById(ids)
                                        .stream()
                                        .collect(Collectors.toMap(TripType::getTypeID, t -> t))
                        )
                );
    }
}
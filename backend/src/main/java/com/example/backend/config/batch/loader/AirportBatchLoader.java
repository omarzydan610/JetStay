package com.example.backend.config.batch.loader;

import com.example.backend.entity.Airport;
import com.example.backend.repository.AirportRepository;
import lombok.RequiredArgsConstructor;
import org.dataloader.MappedBatchLoader;
import org.springframework.stereotype.Component;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class AirportBatchLoader implements MappedBatchLoader<Integer, Airport> {

    private final AirportRepository repo;

    @Override
    public CompletableFuture<Map<Integer, Airport>> load(Set<Integer> keys) {

        return CompletableFuture.supplyAsync(() ->
                repo.findAllById(keys)
                        .stream()
                        .collect(Collectors.toMap(
                                Airport::getAirportID,       // key
                                airport -> airport    // value
                        ))
        );
    }
}


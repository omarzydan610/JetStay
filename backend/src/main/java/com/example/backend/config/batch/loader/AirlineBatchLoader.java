package com.example.backend.config.batch.loader;

import com.example.backend.entity.Airline;
import com.example.backend.repository.AirlineRepository;
import lombok.RequiredArgsConstructor;
import org.dataloader.MappedBatchLoader;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.Set;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class AirlineBatchLoader implements MappedBatchLoader<Integer, Airline> {

    private final AirlineRepository repo;

    @Override
    public CompletableFuture<Map<Integer, Airline>> load(Set<Integer> keys) {

        return CompletableFuture.supplyAsync(() ->
                repo.findAllById(keys)
                        .stream()
                        .collect(Collectors.toMap(
                                Airline::getAirlineID,       // key
                                airline -> airline    // value
                        ))
        );
    }
}

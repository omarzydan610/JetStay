package com.example.backend.config.batch.loader;

import com.example.backend.entity.TripType;
import com.example.backend.repository.TripTypeRepository;
import lombok.RequiredArgsConstructor;
import org.dataloader.MappedBatchLoader;
import org.springframework.stereotype.Component;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class TripTypeBatchLoader implements MappedBatchLoader<Integer, TripType> {

    private final TripTypeRepository repo;

    @Override
    public CompletableFuture<Map<Integer, TripType>> load(Set<Integer> keys) {

        System.out.println("Fetching tripTypes from DB: " + keys);


        return CompletableFuture.supplyAsync(() ->
                repo.findAllById(keys)
                        .stream()
                        .collect(Collectors.toMap(
                                TripType::getTypeID,       // key
                                tripType -> tripType    // value
                        ))
        );
    }
}



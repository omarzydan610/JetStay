package com.example.backend.config.data.loader;

import com.example.backend.config.batch.loader.AirlineBatchLoader;
import com.example.backend.config.batch.loader.AirportBatchLoader;
import com.example.backend.config.batch.loader.TripTypeBatchLoader;
import org.dataloader.DataLoaderFactory;
import org.dataloader.DataLoaderRegistry;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class MyDataLoaderRegistryFactory {

    @Autowired
    private AirlineBatchLoader airlineBatchLoader;

    @Autowired
    private AirportBatchLoader airportBatchLoader;

    @Autowired
    private TripTypeBatchLoader tripTypeBatchLoader;

    public DataLoaderRegistry create() {

        DataLoaderRegistry registry = new DataLoaderRegistry();

        registry.register("airlineLoader",
                DataLoaderFactory.newMappedDataLoader(airlineBatchLoader));

        registry.register("airportLoader",
                DataLoaderFactory.newMappedDataLoader(airportBatchLoader));

        registry.register("tripTypeLoader",
                DataLoaderFactory.newMappedDataLoader(tripTypeBatchLoader));

        return registry;
    }
}

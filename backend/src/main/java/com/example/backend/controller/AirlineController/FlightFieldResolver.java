package com.example.backend.controller.AirlineController;

import com.example.backend.entity.Airline;
import com.example.backend.entity.Airport;
import com.example.backend.entity.Flight;
import com.example.backend.entity.TripType;
import org.dataloader.DataLoader;
import org.springframework.graphql.data.method.annotation.SchemaMapping;
import org.springframework.stereotype.Controller;

import java.util.List;
import java.util.concurrent.CompletableFuture;

@Controller
public class FlightFieldResolver {

    @SchemaMapping(typeName = "Flight", field = "airline")
    public CompletableFuture<Airline> getAirline(Flight flight,
                                                 DataLoader<Integer, Airline> airlineLoader) {
        return airlineLoader.load(flight.getAirline().getAirlineID());
    }

    @SchemaMapping(typeName = "Flight", field = "departureAirport")
    public CompletableFuture<Airport> getDepartureAirport(Flight flight,
                                                          DataLoader<Integer, Airport> airportLoader) {
        return airportLoader.load(flight.getDepartureAirport().getAirportID());
    }

    @SchemaMapping(typeName = "Flight", field = "arrivalAirport")
    public CompletableFuture<Airport> getArrivalAirport(Flight flight,
                                                        DataLoader<Integer, Airport> airportLoader) {
        return airportLoader.load(flight.getArrivalAirport().getAirportID());
    }

    @SchemaMapping(typeName = "Flight", field = "tripsTypes")
    public CompletableFuture<List<TripType>> getTripTypes(Flight flight,
                                                          DataLoader<Integer, TripType> tripTypeLoader) {
        return tripTypeLoader.loadMany(
                flight.getTripsTypes().stream()
                        .map(TripType::getTypeID)
                        .toList()
        );
    }
}

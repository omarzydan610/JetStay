package com.example.backend.repository;

import com.example.backend.entity.FlightOffer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FlightOfferRepository extends JpaRepository<FlightOffer, Integer> {
    List<FlightOffer> findByApplicableFlight_FlightID(Integer flightId);
    List<FlightOffer> findByApplicableAirline_AirlineID(Integer airlineId);
}
package com.example.backend.repository;

import com.example.backend.entity.Flight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FlightRepository extends JpaRepository<Flight, Integer> {

    // Find all flights by airline ID
    List<Flight> findByAirlineAirlineID(int airlineId);

    // Find flights by airline ID with pagination
    @Query("SELECT f FROM Flight f WHERE f.airline.airlineID = :airlineId ORDER BY f.flightID ASC")
    List<Flight> findByAirlineAirlineID(
            @Param("airlineId") Integer airlineId,
            org.springframework.data.domain.Pageable pageable);

    // Get only flight IDs for a specific airline
    @Query("SELECT f.flightID FROM Flight f WHERE f.airline.airlineID = :airlineId")
    List<Integer> allFlightsIdsByAirlineId(@Param("airlineId") Integer airlineId);

    @Query("SELECT f.flightID FROM Flight f")
    List<Integer> allFlightsIds();

    long countByAirlineAirlineIDAndStatus(Integer airlineId, Flight.FlightStatus flightStatus);

    long countByStatus(Flight.FlightStatus flightStatus);

    List<Flight> findByAirline_AirlineID(Integer airlineId);

}

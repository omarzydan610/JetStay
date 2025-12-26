package com.example.backend.repository;

import com.example.backend.dto.AirlineDTO.FlightDetailsDTO;
import com.example.backend.entity.Flight;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FlightRepository extends JpaRepository<Flight, Integer>, JpaSpecificationExecutor<Flight> {

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

    boolean existsById(Integer flightID);

    @Query("""
                SELECT new com.example.backend.dto.AirlineDTO.FlightDetailsDTO(
                    f.departureDate,
                    f.arrivalDate,
                    f.status,
                    dep.airportName,
                    dep.city,
                    arr.airportName,
                    arr.city,
                    f.planeType,
                    tt.typeName,
                    tt.price,
                    al.logoUrl,
                    al.airlineName
                )
                FROM Flight f
                LEFT JOIN f.airline al
                LEFT JOIN f.departureAirport dep
                LEFT JOIN f.arrivalAirport arr
                LEFT JOIN TripType tt ON tt.flight = f
                WHERE f.flightID = :flightId
            """)
    List<FlightDetailsDTO> getFlightDetails(@Param("flightId") Integer flightId);

    @EntityGraph(attributePaths = { "airline", "departureAirport", "arrivalAirport" })
    Page<Flight> findAll(Pageable pageable);

    // @Query("SELECT f.tripsTypes.quantity - FROM Flight f WHERE f.flightID =
    // :flightID AND f.tripsTypes.typeID = :tripTypeID")
    // Integer findAvailableSeatsByFlightIDAndTripTypeID(Integer flightID, Integer
    // tripTypeID);
    Flight getByFlightID(Integer flightID);

    @EntityGraph(attributePaths = { "airline", "departureAirport", "arrivalAirport" })
    @Query("SELECT f FROM Flight f WHERE f.departureDate > CURRENT_TIMESTAMP")
    Page<Flight> findAllAvailableFlight(Pageable pageable);

}

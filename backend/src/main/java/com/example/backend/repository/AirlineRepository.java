package com.example.backend.repository;

import com.example.backend.entity.Airline;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AirlineRepository extends JpaRepository<Airline, Integer> {

    @Query("SELECT a.airlineName FROM Airline a WHERE a.airlineID = :airlineID")
    String findNameById(@Param("airlineID") int airlineID);

    @Query(
        value = "SELECT airline_id FROM airlines WHERE airline_name = :airlineName",
        nativeQuery = true
    )
    Integer findAirlineIDByAirlineName(@Param("airlineName") String airlineName);

    boolean existsByAirlineName(String airlineName);

    Airline findByAirlineName(String airlineName);
}
    List<Airline> findByAdminUserID(Integer userID);
}

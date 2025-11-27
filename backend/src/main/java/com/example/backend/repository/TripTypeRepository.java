package com.example.backend.repository;

import com.example.backend.entity.TripType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TripTypeRepository extends JpaRepository<TripType, Integer> {


    @Query("SELECT t.typeName, AVG(t.quantity) " +
            "FROM TripType t " +
            "WHERE t.flight.airline.airlineID = :airlineID " +
            "GROUP BY t.typeName")
    List<Object[]> findAverageTicketsByTypeForAirlineID(@Param("airlineID") int airlineID);


    @Query("SELECT t.typeName, AVG(t.quantity) " +
            "FROM TripType t " +
            "GROUP BY t.typeName")
    List<Object[]> findAverageTicketsByTypeForAllAirlines();
}

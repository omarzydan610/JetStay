package com.example.backend.repository;

import com.example.backend.entity.Flight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface FlightRepository extends JpaRepository<Flight, Integer> {

    List<Flight> findByAirlineId(int airlineId);
}

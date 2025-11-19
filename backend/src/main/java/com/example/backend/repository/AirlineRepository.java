package com.example.backend.repository;

import com.example.backend.entity.Airline;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface AirlineRepository extends JpaRepository<Airline, Integer> {
    
}

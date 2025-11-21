package com.example.backend.repository;

import com.example.backend.entity.TripType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface TripTypeRepository extends JpaRepository<TripType, Integer> {

}

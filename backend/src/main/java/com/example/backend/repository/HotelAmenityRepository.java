package com.example.backend.repository;

import com.example.backend.entity.HotelAmenity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HotelAmenityRepository extends JpaRepository<HotelAmenity, Integer> {

}

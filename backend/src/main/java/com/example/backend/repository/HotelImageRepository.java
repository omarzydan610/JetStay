package com.example.backend.repository;

import com.example.backend.entity.HotelImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface HotelImageRepository extends JpaRepository<HotelImage, Integer> {
    
}

package com.example.backend.repository;

import com.example.backend.entity.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface HotelRepository extends JpaRepository<Hotel, Integer> {
    List<Hotel> findByAdminUserID(Integer userID);
}

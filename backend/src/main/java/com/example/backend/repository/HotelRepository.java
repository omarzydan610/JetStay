package com.example.backend.repository;

import com.example.backend.entity.Hotel;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HotelRepository extends JpaRepository<Hotel, Integer> {

  Optional<Hotel> findByAdminUserID(Integer userID);
  Optional<Hotel> findByAdmin_Email(String email);
}

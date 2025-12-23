package com.example.backend.repository;

import com.example.backend.entity.RoomOffer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomOfferRepository extends JpaRepository<RoomOffer, Integer> {
    List<RoomOffer> findByApplicableHotel_HotelID(Integer hotelId);
}
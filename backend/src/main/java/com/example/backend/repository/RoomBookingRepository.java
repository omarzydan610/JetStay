package com.example.backend.repository;

import com.example.backend.entity.Hotel;
import com.example.backend.entity.RoomBooking;

import java.time.LocalDate;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface RoomBookingRepository extends JpaRepository<RoomBooking, Integer> {
    @Query("SELECT SUM(rb.noOfRooms) FROM RoomBooking rb WHERE rb.roomType.roomTypeID = :roomTypeID AND (rb.checkIn < :checkOut OR rb.checkOut > :checkIn)")
    public Integer getNumberOfBookedRoom(LocalDate checkIn , LocalDate checkOut , Integer roomTypeID);

    
}

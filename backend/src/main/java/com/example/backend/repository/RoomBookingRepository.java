package com.example.backend.repository;

import com.example.backend.entity.Hotel;
import com.example.backend.entity.RoomBooking;

import java.time.LocalDate;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomBookingRepository extends JpaRepository<RoomBooking, Integer> {
  @Query("SELECT SUM(rb.noOfRooms) FROM RoomBooking rb WHERE rb.roomType.roomTypeID = :roomTypeID AND (rb.checkIn < :checkOut OR rb.checkOut > :checkIn) AND rb.bookingTransaction.status != 'CANCELLED'")
  public Integer getNumberOfBookedRoom(LocalDate checkIn, LocalDate checkOut, Integer roomTypeID);

  // Find upcoming bookings for a user (future check-in dates)
  @Query("SELECT rb FROM RoomBooking rb WHERE rb.user.userID = :userId AND rb.checkIn >= CURRENT_DATE AND rb.bookingTransaction.status != 'CANCELLED' ORDER BY rb.checkIn ASC")
  List<RoomBooking> findUpcomingBookingsByUserId(@Param("userId") Integer userId);

  // Find past bookings for a user
  @Query("SELECT rb FROM RoomBooking rb WHERE rb.user.userID = :userId AND (rb.checkOut < CURRENT_DATE OR rb.bookingTransaction.status = 'COMPLETED' OR rb.bookingTransaction.status = 'CANCELLED') ORDER BY rb.bookingTransaction.bookingDate DESC")
  List<RoomBooking> findPastBookingsByUserId(@Param("userId") Integer userId);
}

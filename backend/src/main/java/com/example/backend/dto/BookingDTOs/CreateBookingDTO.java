package com.example.backend.dto.BookingDTOs;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateBookingDTO {
    Integer hotelID;
    Integer noOfGuests;
    LocalDate checkIn;
    LocalDate checkOut;
    RoomTypeBookingDTO[] roomTypeBookingDTO;
}

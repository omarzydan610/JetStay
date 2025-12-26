package com.example.backend.dto.BookingDTOs;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RoomTypeBookingDTO {
    Integer roomTypeID;
    Integer noOfRooms;
}

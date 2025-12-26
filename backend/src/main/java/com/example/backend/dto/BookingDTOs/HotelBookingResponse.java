package com.example.backend.dto.BookingDTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

import com.example.backend.entity.BookingTransaction;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HotelBookingResponse {
  private BookingTransaction bookingTransaction;
  private List<RoomBookingResponse> roomBooking;

  @Data
  @NoArgsConstructor
  @AllArgsConstructor
  public class RoomBookingResponse {
    private String roomType;
    private int noOfRooms;
    private double price;
  }
}

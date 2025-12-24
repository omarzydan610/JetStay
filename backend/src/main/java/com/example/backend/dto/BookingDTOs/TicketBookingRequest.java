package com.example.backend.dto.BookingDTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TicketBookingRequest {
    private Integer airlineId;
    private Integer flightId;
    private Integer tripTypeId;
    private Integer quantity;
}

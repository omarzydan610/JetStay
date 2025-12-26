package com.example.backend.dto.HotelDTO;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class RoomOfferRequest {
    private String offerName;
    private Float discountValue;
    private Integer roomTypeId;
    private Integer hotelId;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Integer maxUsage;
    private Integer minStayNights;
    private Float minBookingAmount;
    private String description;
}
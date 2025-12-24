package com.example.backend.dto.HotelDTO;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class RoomOfferResponse {
    private Integer roomOfferId;
    private String offerName;
    private Float discountValue;
    private String roomTypeName;
    private String hotelName;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Integer maxUsage;
    private Integer currentUsage;
    private Integer minStayNights;
    private Float minBookingAmount;
    private Boolean isActive;
    private String description;
    private LocalDateTime createdAt;
}
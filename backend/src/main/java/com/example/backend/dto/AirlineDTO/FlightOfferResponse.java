package com.example.backend.dto.AirlineDTO;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class FlightOfferResponse {
    private Integer flightOfferId;
    private String offerName;
    private Float discountValue;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Integer maxUsage;
    private Integer currentUsage;
    private Boolean isActive;
    private String description;
    private LocalDateTime createdAt;
}
package com.example.backend.dto.AirlineDTO;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class FlightOfferRequest {
    private String offerName;
    private Float discountValue;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Integer maxUsage;
    private String description;
}

package com.example.backend.dto.HotelDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HotelReviewSummaryDTO {

    private Double staffAvg;
    private Double comfortAvg;
    private Double facilitiesAvg;
    private Double cleanlinessAvg;
    private Double valueForMoneyAvg;
    private Double locationAvg;
}

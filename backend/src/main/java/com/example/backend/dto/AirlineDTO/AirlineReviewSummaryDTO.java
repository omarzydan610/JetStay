package com.example.backend.dto.AirlineDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AirlineReviewSummaryDTO {

    private Double onTimeAvg;
    private Double comfortAvg;
    private Double amenitiesAvg;
    private Double staffAvg;
}

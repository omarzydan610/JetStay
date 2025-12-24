package com.example.backend.dto.AirlineDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AirlineReviewItemDTO {

    private String userName;
    private String tripType;
    private String planeType;
    private Float rating;
    private String comment;
    private LocalDateTime createdAt;
}

package com.example.backend.dto.HotelDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HotelReviewItemDTO {

    private String userName;
    private String roomType;
    private int nights;
    private float rating;
    private String comment;
    private LocalDateTime createdAt;
}
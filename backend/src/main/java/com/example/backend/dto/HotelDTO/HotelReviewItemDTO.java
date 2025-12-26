package com.example.backend.dto.HotelDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HotelReviewItemDTO {

    private String userName;
    private String roomType;
    private Integer nights;
    private float rating;
    private String comment;
    private Timestamp createdAt;
}
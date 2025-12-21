package com.example.backend.dto.HotelDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class HotelReviewRequest {
    private Integer bookingTransactionId;

    private int staffRate;
    private int comfortRate;
    private int facilitiesRate;
    private int cleanlinessRate;
    private int valueForMoneyRate;
    private int locationRate;

    private String comment;
}

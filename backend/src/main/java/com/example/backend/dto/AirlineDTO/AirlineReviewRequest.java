package com.example.backend.dto.AirlineDTO;

import lombok.Data;

@Data
public class AirlineReviewRequest {

    private Integer ticketId;

    private int onTimeRate;
    private int comfortRate;
    private int staffRate;
    private int amenitiesRate;

    private String comment;
}

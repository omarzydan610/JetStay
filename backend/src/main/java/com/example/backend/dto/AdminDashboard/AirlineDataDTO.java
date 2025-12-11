package com.example.backend.dto.AdminDashboard;

import com.example.backend.entity.Airline;
import lombok.Data;

@Data
public class AirlineDataDTO {
    private int id;
    private String logoURL;
    private String name;
    private String nationality;
    private Float rate;
    private Airline.Status status;
}

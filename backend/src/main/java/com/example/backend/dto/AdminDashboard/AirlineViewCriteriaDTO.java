package com.example.backend.dto.AdminDashboard;

import com.example.backend.entity.Airline;
import lombok.Data;

@Data
public class AirlineViewCriteriaDTO {
    private String search;
    private String nationality;
    private Airline.Status status;
    private int page;
    private int size;
}

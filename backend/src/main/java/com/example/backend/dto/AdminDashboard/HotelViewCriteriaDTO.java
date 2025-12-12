package com.example.backend.dto.AdminDashboard;

import com.example.backend.entity.Hotel;
import lombok.Data;

@Data
public class HotelViewCriteriaDTO {
    private String search;
    private String country;
    private String city;
    private Hotel.Status status;
    private int page;
    private int size;
}

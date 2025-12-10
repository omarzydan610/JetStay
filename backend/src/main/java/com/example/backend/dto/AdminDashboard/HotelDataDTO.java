package com.example.backend.dto.AdminDashboard;

import com.example.backend.entity.Hotel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class HotelDataDTO {
    private int id;
    private String logoURL;
    private String name;
    private String country;
    private String city;
    private Float rate;
    private Hotel.Status status;
}

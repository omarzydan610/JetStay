package com.example.backend.dto.HotelDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class HotelUpdateDataRequest {
    private String name;
    private String city;
    private String country;
    private Double latitude;
    private Double longitude;
    private String logoUrl;
}
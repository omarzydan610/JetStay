package com.example.backend.mapper;

import com.example.backend.dto.AdminDashboard.AirlineDataDTO;
import com.example.backend.entity.Airline;

public class AirlineViewDataMapper {
    public AirlineDataDTO DataToDTO(Airline airline){
        AirlineDataDTO dto = new AirlineDataDTO();
        dto.setId(airline.getAirlineID());
        dto.setName(airline.getAirlineName());
        dto.setLogoURL(airline.getLogoUrl());
        dto.setNationality(airline.getAirlineNationality());
        dto.setRate(airline.getAirlineRate());
        dto.setStatus(airline.getStatus());
        return dto;
    }
}

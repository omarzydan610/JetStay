package com.example.backend.mapper;

import com.example.backend.dto.AdminDashboard.HotelDataDTO;
import com.example.backend.entity.Hotel;

public class HotelViewDataMapper {
    public HotelDataDTO DataToDTO(Hotel hotel){
        HotelDataDTO dto = new HotelDataDTO();
        dto.setId(hotel.getHotelID());
        dto.setLogoURL(hotel.getLogoUrl());
        dto.setName(hotel.getHotelName());
        dto.setCountry(hotel.getCountry());
        dto.setCity(hotel.getCity());
        dto.setRate(hotel.getHotelRate());
        dto.setStatus(hotel.getStatus());
        return dto;
    }
}

package com.example.backend.mapper;

import com.example.backend.dto.HotelDTO.HotelDataResponse;
import com.example.backend.entity.Hotel;

public class HotelDataMapper {
  public static HotelDataResponse mapToResponse(Hotel hotel) {
    HotelDataResponse response = new HotelDataResponse(hotel.getHotelName(),
        hotel.getCity(),
        hotel.getCountry(),
        hotel.getLongitude(),
        hotel.getLatitude(),
        hotel.getHotelRate(),
        hotel.getNumberOfRates(),
        hotel.getLogoUrl(),
        hotel.getStatus());
    return response;
  }
}

package com.example.backend.mapper;

import org.springframework.stereotype.Component;
import com.example.backend.entity.Hotel;
import com.example.backend.entity.User;


@Component
public class HotelMapper {
  public Hotel createHotel(String name,Double latitude, Double longitude, String city, String country, User admin, String logoURL) {
    Hotel hotel = new Hotel();
    hotel.setHotelName(name);
    hotel.setLatitude(latitude);
    hotel.setLongitude(longitude);
    hotel.setCity(city);
    hotel.setCountry(country);
    hotel.setNumberOfRates(0);
    hotel.setHotelRate(0.0f);
    hotel.setAdmin(admin);
    hotel.setLogoUrl(logoURL);
    hotel.setStatus(Hotel.Status.INACTIVE);
    return hotel;
  }
}

package com.example.backend.mapper;

import org.springframework.stereotype.Component;
import com.example.backend.entity.Airline;
import com.example.backend.entity.User;

@Component
public class AirlineMapper {
  public Airline createAirline(String name, String nationality, User admin, String logoURL) {
    Airline airline = new Airline();
    airline.setAirlineName(name);
    airline.setAirlineNationality(nationality);
    airline.setNumberOfRates(0);
    airline.setAirlineRate(0.0f);
    airline.setAdmin(admin);
    airline.setLogoUrl(logoURL);
    airline.setStatus(Airline.Status.INACTIVE);
    return airline;
  }
}

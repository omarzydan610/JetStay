package com.example.backend.mapper;

import com.example.backend.dto.AirlineDTO.AirlineDataResponse;
import com.example.backend.entity.Airline;

public class AirlineDataMapper {
  public static AirlineDataResponse mapToResponse(Airline airline) {
    AirlineDataResponse response = new AirlineDataResponse(airline.getAirlineName(),
        airline.getAirlineNationality(),
        airline.getAirlineRate(),
        airline.getNumberOfRates(),
        airline.getLogoUrl(),
        airline.getStatus());
    return response;
  }
}

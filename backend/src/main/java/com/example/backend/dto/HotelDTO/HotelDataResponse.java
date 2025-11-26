package com.example.backend.dto.HotelDTO;

import com.example.backend.entity.Hotel;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class HotelDataResponse {
  private String name;
  private String city;
  private String country;
  private Double longitude;
  private Double latitude;
  private Float rate;
  private Integer numberOfRates;
  private String logoUrl;
  private Hotel.Status status;
}

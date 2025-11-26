package com.example.backend.dto.AirlineDTO;

import com.example.backend.entity.Airline;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class AirlineDataResponse {
  private String name;
  private String nationality;
  private Float rate;
  private Integer numberOfRates;
  private String logoUrl;
  private Airline.Status status;
}
package com.example.backend.dto.AirlineDTO;

import com.example.backend.entity.Airline;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class AirlineDataResponse {
  String name;
  String nationality;
  Float rate;
  Integer numberOfRates;
  String logoUrl;
  Airline.Status status;
}
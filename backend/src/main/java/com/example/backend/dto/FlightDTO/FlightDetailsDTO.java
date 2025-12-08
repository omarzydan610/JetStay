package com.example.backend.dto.FlightDTO;

import com.example.backend.entity.Flight;
import com.example.backend.entity.TripType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class FlightDetailsDTO {
    private LocalDateTime departureDate;
    private LocalDateTime arrivalDate;
    private Flight.FlightStatus status;

    private String departureAirportName;
    private String departureAirportCity;

    private String arrivalAirportName;
    private String arrivalAirportCity;

    private String planeType;
    private TripType.TripTypeName tripType;
    private Integer price;

    private String airlineLogoURL;
    private String airlineName;
}

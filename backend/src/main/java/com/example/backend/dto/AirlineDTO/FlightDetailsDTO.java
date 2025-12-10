package com.example.backend.dto.AirlineDTO;

import com.example.backend.entity.Flight;
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
    private String tripType;
    private Integer price;

    private String airlineLogoURL;
    private String airlineName;
}

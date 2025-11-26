package com.example.backend.dto.FlightDTO;
import lombok.Data;

@Data
public class FlightRequest {
    private int departureAirportInt;
    private int arrivalAirportInt;
    private String departureDate;
    private String arrivalDate;
    private String status;
    private String description;
    private String planeType;
    
}

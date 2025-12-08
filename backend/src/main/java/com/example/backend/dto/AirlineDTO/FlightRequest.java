package com.example.backend.dto.AirlineDTO;

import lombok.Data;
import java.util.List;

@Data
public class FlightRequest {
    private int departureAirportInt;
    private int arrivalAirportInt;
    private String departureDate;
    private String arrivalDate;
    private String status;
    private String description;
    private String planeType;
    private List<TicketTypeDTO> ticketTypes;

}

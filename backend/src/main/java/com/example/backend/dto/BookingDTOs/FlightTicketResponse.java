package com.example.backend.dto.BookingDTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.example.backend.entity.FlightTicket;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FlightTicketResponse {
    private Integer ticketId;
    private Boolean isPaid;
    private String state;
    private LocalDate createdAt;
    private LocalDate flightDate;
    private Float price;

    // Trip details
    private String tripType;
    private Float tripPrice;

    // Flight details
    private Integer flightId;
    private String departureAirport;
    private String arrivalAirport;
    private String departureCity;
    private String arrivalCity;
    private LocalDateTime departureDate;
    private LocalDateTime arrivalDate;

    // Airline details
    private Integer airlineId;
    private String airlineName;
    private String airlineNationality;

    public static FlightTicketResponse fromEntity(FlightTicket ticket) {
        if (ticket == null) {
            return null;
        }

        FlightTicketResponse response = new FlightTicketResponse();
        response.setTicketId(ticket.getTicketId());
        response.setIsPaid(ticket.getIsPaid());
        response.setState(ticket.getState() != null ? ticket.getState().name() : null);
        response.setCreatedAt(ticket.getCreatedAt());
        response.setFlightDate(ticket.getFlightDate());
        response.setPrice(ticket.getPrice());

        // Trip details
        if (ticket.getTripType() != null) {
            response.setTripType(ticket.getTripType().getTypeName());
            response.setTripPrice(ticket.getTripType().getPrice().floatValue());
        }

        // Flight details
        if (ticket.getFlight() != null) {
            response.setFlightId(ticket.getFlight().getFlightID());
            response.setDepartureDate(ticket.getFlight().getDepartureDate());
            response.setArrivalDate(ticket.getFlight().getArrivalDate());

            if (ticket.getFlight().getDepartureAirport() != null) {
                response.setDepartureAirport(ticket.getFlight().getDepartureAirport().getAirportName());
                response.setDepartureCity(ticket.getFlight().getDepartureAirport().getCity());
            }

            if (ticket.getFlight().getArrivalAirport() != null) {
                response.setArrivalAirport(ticket.getFlight().getArrivalAirport().getAirportName());
                response.setArrivalCity(ticket.getFlight().getArrivalAirport().getCity());
            }

            // Airline details
            if (ticket.getFlight().getAirline() != null) {
                response.setAirlineId(ticket.getFlight().getAirline().getAirlineID());
                response.setAirlineName(ticket.getFlight().getAirline().getAirlineName());
                response.setAirlineNationality(ticket.getFlight().getAirline().getAirlineNationality());
            }
        }

        return response;
    }
}

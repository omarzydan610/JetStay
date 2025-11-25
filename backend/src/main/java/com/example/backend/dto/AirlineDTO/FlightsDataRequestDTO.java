package com.example.backend.dto.AirlineDTO;

import java.time.LocalDateTime;

public class FlightsDataRequestDTO {
    private final Integer flightId;
    private final Integer airlineId;
    private final String departureAirport;
    private final String arrivalAirport;
    private final LocalDateTime departureDate;
    private final LocalDateTime arrivalDate;
    private final String status;
    private final String description;
    private final String planeType;

    private FlightsDataRequestDTO(Builder builder) {
        this.flightId = builder.flightId;
        this.airlineId = builder.airlineId;
        this.departureAirport = builder.departureAirport;
        this.arrivalAirport = builder.arrivalAirport;
        this.departureDate = builder.departureDate;
        this.arrivalDate = builder.arrivalDate;
        this.status = builder.status;
        this.description = builder.description;
        this.planeType = builder.planeType;
    }

    public static class Builder {
        private Integer flightId;
        private Integer airlineId;
        private String departureAirport;
        private String arrivalAirport;
        private LocalDateTime departureDate;
        private LocalDateTime arrivalDate;
        private String status;
        private String description;
        private String planeType;

        public Builder flightId(Integer flightId) { this.flightId = flightId; return this; }
        public Builder airlineId(Integer airlineId) { this.airlineId = airlineId; return this; }
        public Builder departureAirport(String name) { this.departureAirport = name; return this; }
        public Builder arrivalAirport(String name) { this.arrivalAirport = name; return this; }
        public Builder departureDate(LocalDateTime date) { this.departureDate = date; return this; }
        public Builder arrivalDate(LocalDateTime date) { this.arrivalDate = date; return this; }
        public Builder status(String status) { this.status = status; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder planeType(String planeType) { this.planeType = planeType; return this; }

        public FlightsDataRequestDTO build() { return new FlightsDataRequestDTO(this); }
    }

    public Integer getFlightId() { return flightId; }
    public Integer getAirlineId() { return airlineId; }
    public String getDepartureAirport() { return departureAirport; }
    public String getArrivalAirport() { return arrivalAirport; }
    public LocalDateTime getDepartureDate() { return departureDate; }
    public LocalDateTime getArrivalDate() { return arrivalDate; }
    public String getStatus() { return status; }
    public String getDescription() { return description; }
    public String getPlaneType() { return planeType; }
}

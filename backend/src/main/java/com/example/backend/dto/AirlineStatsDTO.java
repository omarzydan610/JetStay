package com.example.backend.dto;


import java.time.LocalDate;

public class AirlineStatsDTO {
    private final String airlineName;
    private final int totalFlights;
    private final double totalRevenue;
    private final LocalDate lastFlightDate;

    private AirlineStatsDTO(Builder builder) {
        this.airlineName = builder.airlineName;
        this.totalFlights = builder.totalFlights;
        this.totalRevenue = builder.totalRevenue;
        this.lastFlightDate = builder.lastFlightDate;
    }

    public static class Builder {
        private String airlineName;
        private int totalFlights;
        private double totalRevenue;
        private LocalDate lastFlightDate;

        public Builder airlineName(String name) { this.airlineName = name; return this; }
        public Builder totalFlights(int totalFlights) { this.totalFlights = totalFlights; return this; }
        public Builder totalRevenue(double revenue) { this.totalRevenue = revenue; return this; }
        public Builder lastFlightDate(LocalDate date) { this.lastFlightDate = date; return this; }
        public AirlineStatsDTO build() { return new AirlineStatsDTO(this); }
    }

    // getters
    public String getAirlineName() { return airlineName; }
    public int getTotalFlights() { return totalFlights; }
    public double getTotalRevenue() { return totalRevenue; }
    public LocalDate getLastFlightDate() { return lastFlightDate; }
}


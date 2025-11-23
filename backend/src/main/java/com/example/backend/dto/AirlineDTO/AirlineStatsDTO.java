package com.example.backend.dto.AirlineDTO;



public class AirlineStatsDTO {
    private final String airlineName;
    private final double totalFlights;
    private final double totalRevenue;
    private final double avgRating;

    private AirlineStatsDTO(Builder builder) {
        this.airlineName = builder.airlineName;
        this.totalFlights = builder.totalFlights;
        this.totalRevenue = builder.totalRevenue;
        this.avgRating = builder.avgRating;
    }

    public static class Builder {
        private String airlineName;
        private double totalFlights;
        private double totalRevenue;
        private double avgRating;


        public Builder airlineName(String name) { this.airlineName = name; return this; }
        public Builder totalFlights(double totalFlights) { this.totalFlights = totalFlights; return this; }
        public Builder totalRevenue(double revenue) { this.totalRevenue = revenue; return this; }
        public Builder avgRating(double avgRating) { this.avgRating = avgRating; return this; }
        public AirlineStatsDTO build() { return new AirlineStatsDTO(this); }
    }

    // getters
    public String getAirlineName() { return airlineName; }
    public double getTotalFlights() { return totalFlights; }
    public double getTotalRevenue() { return totalRevenue; }
    public double getAvgRating() { return avgRating; }

}


package com.example.backend.dto.AirlineDTO;

public class AirlineStatisticsResponse {
    private final double totalFlights;
    private final double totalRevenue;
    private final double avgRating;
    private final long pendingCount;
    private final long onTimeCount;
    private final long cancelledCount;

    private AirlineStatisticsResponse(Builder builder) {
        this.totalFlights = builder.totalFlights;
        this.totalRevenue = builder.totalRevenue;
        this.avgRating = builder.avgRating;
        this.pendingCount = builder.pendingCount;
        this.onTimeCount = builder.onTimeCount;
        this.cancelledCount = builder.cancelledCount;
    }

    public static class Builder {
        private double totalFlights;
        private double totalRevenue;
        private double avgRating;
        private long pendingCount;
        private long onTimeCount;
        private long cancelledCount;

        public Builder totalFlights(double totalFlights) {
            this.totalFlights = totalFlights;
            return this;
        }

        public Builder totalRevenue(double revenue) {
            this.totalRevenue = revenue;
            return this;
        }

        public Builder avgRating(double avgRating) {
            this.avgRating = avgRating;
            return this;
        }

        public Builder pendingCount(long pendingCount) {
            this.pendingCount = pendingCount;
            return this;
        }

        public Builder onTimeCount(long onTimeCount) {
            this.onTimeCount = onTimeCount;
            return this;
        }

        public Builder cancelledCount(long cancelledCount) {
            this.cancelledCount = cancelledCount;
            return this;
        }

        public AirlineStatisticsResponse build() {
            return new AirlineStatisticsResponse(this);
        }
    }

    // getters
    public double getTotalFlights() {
        return totalFlights;
    }

    public double getTotalRevenue() {
        return totalRevenue;
    }

    public double getAvgRating() {
        return avgRating;
    }

    public long getPendingCount() {
        return pendingCount;
    }

    public long getOnTimeCount() {
        return onTimeCount;
    }

    public long getCancelledCount() {
        return cancelledCount;
    }
}

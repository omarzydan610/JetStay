package com.example.backend.dto.AirlineDTO;

import java.util.Map;

public class TripTypeStatsRequestDTO {

    private String airlineName;
    private Map<String, Double> averageTicketsPerType;

    public TripTypeStatsRequestDTO() {
    }

    public TripTypeStatsRequestDTO(String airlineName, Map<String, Double> averageTicketsPerType) {
        this.airlineName = airlineName;
        this.averageTicketsPerType = averageTicketsPerType;
    }

    public String getAirlineName() {
        return airlineName;
    }

    public void setAirlineName(String airlineName) {
        this.airlineName = airlineName;
    }

    public Map<String, Double> getAverageTicketsPerType() {
        return averageTicketsPerType;
    }

    public void setAverageTicketsPerType(Map<String, Double> averageTicketsPerType) {
        this.averageTicketsPerType = averageTicketsPerType;
    }
}

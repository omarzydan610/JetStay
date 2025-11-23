package com.example.backend.dto;

import com.example.backend.entity.TripType.TripTypeName;
import java.util.Map;

public class TripTypeStatsDTO {

    private String airlineName;
    private Map<TripTypeName, Double> averageTicketsPerType;

    public TripTypeStatsDTO() {}

    public TripTypeStatsDTO(String airlineName, Map<TripTypeName, Double> averageTicketsPerType) {
        this.airlineName = airlineName;
        this.averageTicketsPerType = averageTicketsPerType;
    }

    public String getAirlineName() {
        return airlineName;
    }

    public void setAirlineName(String airlineName) {
        this.airlineName = airlineName;
    }

    public Map<TripTypeName, Double> getAverageTicketsPerType() {
        return averageTicketsPerType;
    }

    public void setAverageTicketsPerType(Map<TripTypeName, Double> averageTicketsPerType) {
        this.averageTicketsPerType = averageTicketsPerType;
    }
}

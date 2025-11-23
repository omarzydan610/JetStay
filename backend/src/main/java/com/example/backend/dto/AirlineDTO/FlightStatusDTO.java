package com.example.backend.dto.AirlineDTO;

public class FlightStatusDTO {
    private long pendingCount;
    private long onTimeCount;

    public FlightStatusDTO(long pendingCount, long onTimeCount) {
        this.pendingCount = pendingCount;
        this.onTimeCount = onTimeCount;
    }

    public long getPendingCount() {
        return pendingCount;
    }

    public long getOnTimeCount() {
        return onTimeCount;
    }
}

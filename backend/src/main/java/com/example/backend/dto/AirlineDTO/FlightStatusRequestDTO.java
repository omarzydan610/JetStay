package com.example.backend.dto.AirlineDTO;

public class FlightStatusRequestDTO {
    private long pendingCount;
    private long onTimeCount;

    public FlightStatusRequestDTO(long pendingCount, long onTimeCount) {
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

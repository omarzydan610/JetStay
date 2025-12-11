package com.example.backend.dto.HotelDTO;

import lombok.Data;

@Data
public class RoomFilterDTO {
    // ===== Room Filters =====
    private String roomNameContains;
    private String roomTypeContains;
    private Float priceGte;
    private Float priceLte;

    // ===== Hotel Info Filters (optional) =====
    private Integer hotelID;
    private String hotelNameContains;
    private String cityContains;
    private String countryContains;
    private Float hotelRateGte;
    private Float hotelRateLte;
    private Integer numberOfRatesGte;
    private Integer numberOfRatesLte;
    private Integer adminID;
    private String status;          // ACTIVE/INACTIVE
    private String createdAfter;    // ISO date string
    private String createdBefore;   // ISO date string
}
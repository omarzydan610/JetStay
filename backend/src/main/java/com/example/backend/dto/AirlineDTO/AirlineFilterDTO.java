package com.example.backend.dto.AirlineDTO;

import lombok.Data;

@Data
public class AirlineFilterDTO {
    private Double priceLt;
    private Double priceGt;
    private Double ratingGte;
    private Double ratingLte;
    private String country;
    private String nameContains;
}

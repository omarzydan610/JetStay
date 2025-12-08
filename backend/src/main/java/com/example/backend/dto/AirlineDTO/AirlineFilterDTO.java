package com.example.backend.dto.AirlineDTO;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class AirlineFilterDTO {
    private Double ratingGte;
    private Double ratingLte;
    private String airlineNationalityContains;
    private String nameContains;
}

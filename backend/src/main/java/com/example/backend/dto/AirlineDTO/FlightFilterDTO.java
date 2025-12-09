package com.example.backend.dto.AirlineDTO;

import com.example.backend.entity.Flight.FlightStatus;
import com.example.backend.entity.TripType;
import lombok.Data;

import java.util.List;

@Data
public class FlightFilterDTO {
    // Flight filters
    private Integer flightId;
    private String airlineNameContains;
    private Float airlineRatingGte;
    private Float airlineRatingLte;
    private String airlineNationalityContains;
    private String departureAirportNameContains;
    private String departureCityContains;      // new
    private String departureCountryContains;   // new
    private String arrivalAirportNameContains;
    private String arrivalCityContains;        // new
    private String arrivalCountryContains;     // new
    private String departureDateGte;
    private String departureDateLte;
    private String arrivalDateGte;
    private String arrivalDateLte;
    private FlightStatus status;
    private String tripTypeNameContains;
    private Float tripTypePriceGte;
    private Float tripTypePriceLte;
}

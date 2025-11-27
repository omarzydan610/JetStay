package com.example.backend.repository;

import com.example.backend.entity.Airport;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;


@Repository
public interface AirportRepository extends JpaRepository<Airport, Integer> {
    @Query("SELECT DISTINCT new com.example.backend.dto.AirlineDTO.CountryDtoResponse(a.country) FROM Airport a GROUP BY a.country")
    java.util.List<com.example.backend.dto.AirlineDTO.CountryDtoResponse> findAllCountries();

    @Query("SELECT DISTINCT new com.example.backend.dto.AirlineDTO.CityDtoResponse(a.city) FROM Airport a WHERE a.country = :country GROUP BY a.city")
    java.util.List<com.example.backend.dto.AirlineDTO.CityDtoResponse> findAllCitiesByCountry(String country);

    List<Airport> findByCountryAndCity(String country, String city);
}

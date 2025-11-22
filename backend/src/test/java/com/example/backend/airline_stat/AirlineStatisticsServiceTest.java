package com.example.backend.airline_stat;

import com.example.backend.airline_stat.service.AirlineStatService;
import com.example.backend.dto.AirlineStatsDTO;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class AirlineStatisticsServiceTest {

    @Autowired
    private AirlineStatService airlineStatisticsService;

    @Test
    public void testStatisticsForSpecificAirline() {
        String airlineName = "Emirates"; // replace with an actual airline in your DB

        Double flightCount = airlineStatisticsService.getAirlinecount(airlineName);
        Double avgRating = airlineStatisticsService.getAirlineAvgRating(airlineName);
        Double revenue = airlineStatisticsService.getAirlineRevenue(airlineName);

        System.out.println("Flight count: " + flightCount);
        System.out.println("Average rating: " + avgRating);
        System.out.println("Revenue: " + revenue);

        assertNotNull(flightCount);
        assertNotNull(avgRating);
        assertNotNull(revenue);

        assertTrue(flightCount >= 0);
        assertTrue(avgRating >= 0 && avgRating <= 5); // assuming rating is out of 5
        assertTrue(revenue >= 0);
    }

    @Test
    public void testStatisticsForAllAirlines() {
        Double flightCount = airlineStatisticsService.getAirlinecount(null);
        Double avgRating = airlineStatisticsService.getAirlineAvgRating(null);
        Double revenue = airlineStatisticsService.getAirlineRevenue(null);

        System.out.println("Flight count (all): " + flightCount);
        System.out.println("Average rating (all): " + avgRating);
        System.out.println("Revenue (all): " + revenue);

        assertNotNull(flightCount);
        assertNotNull(avgRating);
        assertNotNull(revenue);

        assertTrue(flightCount >= 0);
        assertTrue(avgRating >= 0 && avgRating <= 5);
        assertTrue(revenue >= 0);
    }
}

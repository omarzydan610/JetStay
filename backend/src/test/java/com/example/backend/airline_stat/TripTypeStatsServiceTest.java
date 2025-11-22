package com.example.backend.airline_stat;

import com.example.backend.airline_stat.service.TripTypeStatsService;
import com.example.backend.dto.TripTypeStatsDTO;
import com.example.backend.entity.TripType.TripTypeName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
public class TripTypeStatsServiceTest {

    @Autowired
    private TripTypeStatsService tripTypeStatsService;

    @Test
    public void testGetAverageTicketsPerType() {
        String airlineName = "Emirates"; // use a valid airline ID from your test DB

        TripTypeStatsDTO averages = tripTypeStatsService.getTripTypeStats(airlineName);

        // Print results for visual check
        System.out.println(averages.getAirlineName());
        System.out.println(averages.getAverageTicketsPerType());

    }

    @Test
    public void testGetAverageTicketsPerTypeForAll() {
        String airlineName = ""; // use a valid airline ID from your test DB

        TripTypeStatsDTO averages = tripTypeStatsService.getTripTypeStats(airlineName);

        // Print results for visual check
        System.out.println(averages.getAirlineName());
        System.out.println(averages.getAverageTicketsPerType());

    }
}

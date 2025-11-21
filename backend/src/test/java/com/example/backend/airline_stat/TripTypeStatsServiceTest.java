package com.example.backend.airline_stat;

import com.example.backend.airline_stat.service.TripTypeStatsService;
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
        Integer airlineId = 2; // use a valid airline ID from your test DB

        Map<TripTypeName, Double> averages = tripTypeStatsService.getAverageTicketsPerType(airlineId);

        // Print results for visual check
        averages.forEach((type, avg) -> System.out.println(type + " : " + avg));

        // Basic assertions
        assertTrue(averages.size() > 0, "There should be at least one trip type");
        averages.forEach((type, avg) -> {
            assertTrue(avg >= 0, "Average quantity should be non-negative");
        });
    }
}

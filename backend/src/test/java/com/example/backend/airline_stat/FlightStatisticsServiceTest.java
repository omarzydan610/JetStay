package com.example.backend.airline_stat;

import com.example.backend.airline_stat.strategy.FlightCountStatistics;
import com.example.backend.airline_stat.strategy.RevenueStatistics;
import com.example.backend.repository.AirlineRepository;
import com.example.backend.repository.FlightRepository;
import com.example.backend.repository.FlightTicketRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(properties = {
        "spring.datasource.url=jdbc:mysql://localhost:3306/JetStay?useSSL=false&serverTimezone=UTC",
        "spring.datasource.username=Hema",
        "spring.datasource.password=2004",
        "spring.jpa.hibernate.ddl-auto=none"
})
class FlightStatisticsServiceTest {

    @Autowired
    private AirlineRepository airlineRepository;

    @Autowired
    private FlightRepository flightRepository;

    @Autowired
    private FlightTicketRepository flightTicketRepository;

    @Test
    void testFlightCount() {
        String airlineName = "EgyptAir";

        FlightCountStatistics stats = new FlightCountStatistics(
                airlineRepository,
                flightRepository
        );

        Long result = stats.calculate(airlineName);
        System.out.println("Total flights for " + airlineName + ": " + result);
    }

    @Test
    void testRevenue() {
        String airlineName = "EgyptAir";

        RevenueStatistics stats = new RevenueStatistics(
                airlineRepository,
                flightTicketRepository
        );

        Long result = stats.calculate(airlineName);
        System.out.println("Total revenue for " + airlineName + ": " + result);
    }
}

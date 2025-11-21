package com.example.backend.airline_stat;

import com.example.backend.airline_stat.strategy.FlightCountStatistics;
import com.example.backend.airline_stat.strategy.RatingStatistics;
import com.example.backend.airline_stat.strategy.RevenueStatistics;
import com.example.backend.repository.AirlineRepository;
import com.example.backend.repository.FlightRepository;
import com.example.backend.repository.FlightReviewRepository;
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

    @Autowired
    private FlightReviewRepository flightReviewRepository;

    @Test
    void testFlightCount() {
        String airlineName = "EgyptAir";

        FlightCountStatistics stats = new FlightCountStatistics(
                airlineRepository,
                flightRepository
        );

        Double result = stats.calculate(airlineName);
        System.out.println("Total flights for " + airlineName + ": " + result);
    }

    @Test
    void testRevenue() {
        String airlineName = "EgyptAir";

        RevenueStatistics stats = new RevenueStatistics(
                airlineRepository,
                flightTicketRepository
        );

        Double result = stats.calculate(airlineName);
        System.out.println("Total revenue for " + airlineName + ": " + result);
    }

    @Test
    void testAvgRating() {
        String airlineName = "EgyptAir";

        RatingStatistics stats = new RatingStatistics(
                airlineRepository,
                flightRepository,
                flightReviewRepository
        );

        Double result = stats.calculate(airlineName);
        System.out.println("Avg Rating for " + airlineName + ": " + result);
    }

    @Test
    void testAllFlightCount() {
        String airlineName = "";

        FlightCountStatistics stats = new FlightCountStatistics(
                airlineRepository,
                flightRepository
        );

        Double result = stats.calculate(airlineName);
        System.out.println("Total Overall flights : " + result);
    }

    @Test
    void testAllRevenue() {
        String airlineName = "";

        RevenueStatistics stats = new RevenueStatistics(
                airlineRepository,
                flightTicketRepository
        );

        Double result = stats.calculate(airlineName);
        System.out.println("Total Overall revenue : " + result);
    }

    @Test
    void testAllAvgRating() {
        String airlineName = "";

        RatingStatistics stats = new RatingStatistics(
                airlineRepository,
                flightRepository,
                flightReviewRepository
        );

        Double result = stats.calculate(airlineName);
        System.out.println("Avg Overall Rating : " + result);
    }

}

package com.example.backend.service.AirlineService;

import com.example.backend.dto.AirlineDTO.AirlineStatisticsResponse;
import com.example.backend.entity.Airline;
import com.example.backend.entity.Flight;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.exception.UnauthorizedException;
import com.example.backend.repository.AirlineRepository;
import com.example.backend.repository.FlightRepository;
import com.example.backend.strategy.airline_stat.FlightCountStatistics;
import com.example.backend.strategy.airline_stat.RatingStatistics;
import com.example.backend.strategy.airline_stat.RevenueStatistics;
import com.example.backend.strategy.airline_stat.StatisticsContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AirlineStatisticsService {

    @Autowired
    private StatisticsContext statisticsContext;

    @Autowired
    private FlightCountStatistics flightCountStatistics;

    @Autowired
    private RevenueStatistics revenueStatistics;

    @Autowired
    private RatingStatistics ratingStatistics;

    @Autowired
    private AirlineRepository airlineRepository;

    @Autowired
    private FlightRepository flightRepository;

    public Double getAirlinecount(String airlineName) {
        validateAirlineExists(airlineName);
        statisticsContext.setStrategy(flightCountStatistics);
        return statisticsContext.execute(airlineName);
    }

    public Double getAirlineAvgRating(String airlineName) {
        validateAirlineExists(airlineName);
        statisticsContext.setStrategy(ratingStatistics);
        return statisticsContext.execute(airlineName);
    }

    public Double getAirlineRevenue(String airlineName) {
        validateAirlineExists(airlineName);
        statisticsContext.setStrategy(revenueStatistics);
        return statisticsContext.execute(airlineName);
    }

    private void validateAirlineExists(String airlineName) {
        if (airlineName != null && !airlineName.isBlank()) {
            Integer airlineId = airlineRepository.findAirlineIDByAirlineName(airlineName);
            if (airlineId == null) {
                throw new ResourceNotFoundException("Airline", "name", airlineName);
            }
        }
    }

    public AirlineStatisticsResponse getAirlineStatistics(int airlineID) {
        Airline airline = airlineRepository.findById(airlineID).orElse(null);
        if (airline == null) {
            throw new UnauthorizedException("Airline not found for the given ID: " + airlineID);
        }
        String airlineName = airline.getAirlineName();

        // Get flight status counts
        long pendingCount = flightRepository.countByAirlineAirlineIDAndStatus(airlineID, Flight.FlightStatus.PENDING);
        long onTimeCount = flightRepository.countByAirlineAirlineIDAndStatus(airlineID, Flight.FlightStatus.ON_TIME);
        long cancelledCount = flightRepository.countByAirlineAirlineIDAndStatus(airlineID, Flight.FlightStatus.CANCELLED);

        return new AirlineStatisticsResponse.Builder()
                .totalFlights(getAirlinecount(airlineName))
                .totalRevenue(getAirlineRevenue(airlineName))
                .avgRating(getAirlineAvgRating(airlineName))
                .pendingCount(pendingCount)
                .onTimeCount(onTimeCount)
                .cancelledCount(cancelledCount)
                .build();
    }
}

package com.example.backend.strategy.airline_stat;

import org.springframework.stereotype.Component;

@Component
public class StatisticsContext {
    private StatisticsStrategy strategy;

    public void setStrategy(StatisticsStrategy strategy) {
        this.strategy = strategy;
    }

    public Double execute(String airlineName) {
        return strategy.calculate(airlineName);
    }
}
/*
*
*
StatisticsContext context = new StatisticsContext();

// calculate revenue
context.setStrategy(new RevenueStatistics());
context.execute();

// calculate flight count
context.setStrategy(new FlightCountStatistics());
context.execute();

* */

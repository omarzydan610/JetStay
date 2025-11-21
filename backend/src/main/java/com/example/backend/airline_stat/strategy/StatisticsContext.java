package com.example.backend.airline_stat.strategy;

public class StatisticsContext {
    private StatisticsStrategy strategy;

    public void setStrategy(StatisticsStrategy strategy) {
        this.strategy = strategy;
    }

    public void execute(String airlineName) {
        strategy.calculate(airlineName);
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

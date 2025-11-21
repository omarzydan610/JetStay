package com.example.backend.repository;


import com.example.backend.entity.FlightTicket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FlightTicketRepository extends JpaRepository<FlightTicket, Integer> {

    // Find tickets by user ID
    List<FlightTicket> findByUserUserID(Integer userId);

    // Find tickets by flight ID
    List<FlightTicket> findByFlightFlightID(Integer flightId);

    // Find tickets by airline ID
    List<FlightTicket> findByAirlineAirlineID(Integer airlineId);

    List<FlightTicket> findByAirlineAirlineIDAndIsPaidTrue(Integer airlineId);

    List<FlightTicket> findByIsPaidTrue();

    List<FlightTicket> findByAirlineAirlineNameAndIsPaidTrue(String airlineName);
}


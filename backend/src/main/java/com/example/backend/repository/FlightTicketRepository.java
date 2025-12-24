package com.example.backend.repository;

import com.example.backend.entity.FlightTicket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
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

       // Admin monitoring queries
       @Query("SELECT COUNT(ft), COALESCE(SUM(ft.price), 0.0) " +
                     "FROM FlightTicket ft " +
                     "WHERE ft.createdAt BETWEEN :startDate AND :endDate")
       List<Object[]> getTotalTicketsCountBetweenDate(@Param("startDate") LocalDate startDate,
                     @Param("endDate") LocalDate endDate);

       @Query("SELECT ft.isPaid, COUNT(ft) " +
                     "FROM FlightTicket ft " +
                     "WHERE ft.createdAt BETWEEN :startDate AND :endDate " +
                     "GROUP BY ft.isPaid")
       List<Object[]> getTicketCountsByPaymentStatusBetweenDate(@Param("startDate") LocalDate startDate,
                     @Param("endDate") LocalDate endDate);

       @Query("SELECT ft.airline.airlineID, ft.airline.airlineName, COUNT(ft), COALESCE(SUM(ft.price), 0.0) " +
                     "FROM FlightTicket ft " +
                     "WHERE ft.createdAt BETWEEN :startDate AND :endDate " +
                     "GROUP BY ft.airline.airlineID, ft.airline.airlineName " +
                     "ORDER BY COUNT(ft) DESC")
       List<Object[]> getTicketCountsAndRevenueByAirlineBetweenDate(@Param("startDate") LocalDate startDate,
                     @Param("endDate") LocalDate endDate);

       @Query("SELECT ft.flight.status, COUNT(ft) " +
                     "FROM FlightTicket ft " +
                     "WHERE ft.createdAt BETWEEN :startDate AND :endDate " +
                     "GROUP BY ft.flight.status")
       List<Object[]> getFlightCountsByStatusBetweenDate(@Param("startDate") LocalDate startDate,
                     @Param("endDate") LocalDate endDate);

       @Query("SELECT ft.createdAt, COUNT(ft), COALESCE(SUM(ft.price), 0.0) " +
                     "FROM FlightTicket ft " +
                     "WHERE ft.createdAt BETWEEN :startDate AND :endDate " +
                     "GROUP BY ft.createdAt " +
                     "ORDER BY ft.createdAt")
       List<Object[]> getDailyTicketSalesSummary(@Param("startDate") LocalDate startDate,
                     @Param("endDate") LocalDate endDate);

       // Airline-specific filtering queries
       @Query("SELECT COUNT(ft), COALESCE(SUM(ft.price), 0.0) " +
                     "FROM FlightTicket ft " +
                     "WHERE ft.createdAt BETWEEN :startDate AND :endDate AND ft.airline.airlineID = :airlineId")
       List<Object[]> getTotalTicketsCountBetweenDateAndAirline(@Param("startDate") LocalDate startDate,
                     @Param("endDate") LocalDate endDate,
                     @Param("airlineId") Long airlineId);

       @Query("SELECT ft.isPaid, COUNT(ft) " +
                     "FROM FlightTicket ft " +
                     "WHERE ft.createdAt BETWEEN :startDate AND :endDate AND ft.airline.airlineID = :airlineId " +
                     "GROUP BY ft.isPaid")
       List<Object[]> getTicketCountsByPaymentStatusBetweenDateAndAirline(@Param("startDate") LocalDate startDate,
                     @Param("endDate") LocalDate endDate,
                     @Param("airlineId") Long airlineId);

       @Query("SELECT ft.airline.airlineID, ft.airline.airlineName, COUNT(ft), COALESCE(SUM(ft.price), 0.0) " +
                     "FROM FlightTicket ft " +
                     "WHERE ft.createdAt BETWEEN :startDate AND :endDate AND ft.airline.airlineID = :airlineId " +
                     "GROUP BY ft.airline.airlineID, ft.airline.airlineName " +
                     "ORDER BY COUNT(ft) DESC")
       List<Object[]> getTicketCountsAndRevenueByAirlineBetweenDateAndAirline(@Param("startDate") LocalDate startDate,
                     @Param("endDate") LocalDate endDate,
                     @Param("airlineId") Long airlineId);

       @Query("SELECT ft.flight.status, COUNT(ft) " +
                     "FROM FlightTicket ft " +
                     "WHERE ft.createdAt BETWEEN :startDate AND :endDate AND ft.airline.airlineID = :airlineId " +
                     "GROUP BY ft.flight.status")
       List<Object[]> getFlightCountsByStatusBetweenDateAndAirline(@Param("startDate") LocalDate startDate,
                     @Param("endDate") LocalDate endDate,
                     @Param("airlineId") Long airlineId);

       @Query("SELECT ft.createdAt, COUNT(ft), COALESCE(SUM(ft.price), 0.0) " +
                     "FROM FlightTicket ft " +
                     "WHERE ft.createdAt BETWEEN :startDate AND :endDate AND ft.airline.airlineID = :airlineId " +
                     "GROUP BY ft.createdAt " +
                     "ORDER BY ft.createdAt")
       List<Object[]> getDailyTicketSalesSummaryByAirline(@Param("startDate") LocalDate startDate,
                     @Param("endDate") LocalDate endDate,
                     @Param("airlineId") Long airlineId);

       @Query("SELECT ft FROM FlightTicket ft WHERE ft.createdAt BETWEEN :startDate AND :endDate")
       List<FlightTicket> getFlightTicketsDetailBetweenDate(LocalDate startDate,LocalDate endDate);

       @Query("SELECT ft FROM FlightTicket ft WHERE ft.createdAt BETWEEN :startDate AND :endDate AND ft.airline.airlineID = :airlineId")
       List<FlightTicket> getFlightTicketsDetailBetweenDateForArline(LocalDate startDate,LocalDate endDate,Long airlineId);

       // User booking queries
       @Query("SELECT ft FROM FlightTicket ft WHERE ft.user.userID = :userId ORDER BY ft.createdAt DESC")
       List<FlightTicket> findByUserIdOrderByCreatedAtDesc(@Param("userId") Integer userId);
       
       // Find upcoming flights for a user (future flight dates)
       @Query("SELECT ft FROM FlightTicket ft WHERE ft.user.userID = :userId AND ft.flightDate >= CURRENT_DATE AND ft.isPaid = true ORDER BY ft.flightDate ASC")
       List<FlightTicket> findUpcomingFlightsByUserId(@Param("userId") Integer userId);
       
       // Find past flights for a user
       @Query("SELECT ft FROM FlightTicket ft WHERE ft.user.userID = :userId AND ft.flightDate < CURRENT_DATE ORDER BY ft.createdAt DESC")
       List<FlightTicket> findPastFlightsByUserId(@Param("userId") Integer userId);

}

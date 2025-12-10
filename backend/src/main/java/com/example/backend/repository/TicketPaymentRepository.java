package com.example.backend.repository;

import com.example.backend.entity.TicketPayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TicketPaymentRepository extends JpaRepository<TicketPayment, Integer> {

    // Admin monitoring queries
    @Query("SELECT tp.status, COUNT(tp) " +
           "FROM TicketPayment tp " +
           "WHERE CAST(tp.paymentDate AS LocalDate) BETWEEN :startDate AND :endDate " +
           "GROUP BY tp.status")
    List<Object[]> getPaymentCountsByStatusBetweenDate(@Param("startDate") LocalDate startDate,
                                                       @Param("endDate") LocalDate endDate);

    @Query("SELECT tp.method.methodName, COUNT(tp), COALESCE(SUM(tp.amount), 0.0) " +
           "FROM TicketPayment tp " +
           "WHERE CAST(tp.paymentDate AS LocalDate) BETWEEN :startDate AND :endDate " +
           "GROUP BY tp.method.methodName " +
           "ORDER BY COUNT(tp) DESC")
    List<Object[]> getTicketPaymentCountsAndRevenueByMethodBetweenDate(@Param("startDate") LocalDate startDate,
                                                                       @Param("endDate") LocalDate endDate);

    // Airline-specific filtering queries
    @Query("SELECT tp.status, COUNT(tp) " +
           "FROM TicketPayment tp " +
           "WHERE CAST(tp.paymentDate AS LocalDate) BETWEEN :startDate AND :endDate " +
           "AND tp.ticket.airline.airlineID = :airlineId " +
           "GROUP BY tp.status")
    List<Object[]> getPaymentCountsByStatusBetweenDateAndAirline(@Param("startDate") LocalDate startDate,
                                                                 @Param("endDate") LocalDate endDate,
                                                                 @Param("airlineId") Long airlineId);

    @Query("SELECT tp.method.methodName, COUNT(tp), COALESCE(SUM(tp.amount), 0.0) " +
           "FROM TicketPayment tp " +
           "WHERE CAST(tp.paymentDate AS LocalDate) BETWEEN :startDate AND :endDate " +
           "AND tp.ticket.airline.airlineID = :airlineId " +
           "GROUP BY tp.method.methodName " +
           "ORDER BY COUNT(tp) DESC")
    List<Object[]> getTicketPaymentCountsAndRevenueByMethodBetweenDateAndAirline(@Param("startDate") LocalDate startDate,
                                                                                 @Param("endDate") LocalDate endDate,
                                                                                 @Param("airlineId") Long airlineId);
}

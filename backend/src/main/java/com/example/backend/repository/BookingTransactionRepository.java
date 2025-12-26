package com.example.backend.repository;

import com.example.backend.dto.AdminDTO.DatabaseDTO.CountByStateDTO;
import com.example.backend.entity.BookingTransaction;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface BookingTransactionRepository extends JpaRepository<BookingTransaction, Integer> {
        @Query("SELECT COUNT(bt), SUM(bt.totalPrice),SUM(bt.numberOfGuests),SUM(bt.numberOfRooms) FROM BookingTransaction bt WHERE bt.bookingDate BETWEEN :startDate AND :endDate")
        List<Object[]> getTotalBookingsCountBetweenDate(LocalDate startDate, LocalDate endDate);

        @Query("SELECT new com.example.backend.dto.AdminDTO.DatabaseDTO.CountByStateDTO(bt.status, COUNT(bt)) " +
                        "FROM BookingTransaction bt " +
                        "WHERE bt.bookingDate BETWEEN :startDate AND :endDate " +
                        "GROUP BY bt.status")
        List<CountByStateDTO> getBookingCountsByStatusBetweenDate(LocalDate startDate, LocalDate endDate);

        @Query("SELECT bt.hotel.hotelID, bt.hotel.hotelName, COUNT(bt), SUM(bt.totalPrice) " +
                        "FROM BookingTransaction bt " +
                        "WHERE bt.bookingDate BETWEEN :startDate AND :endDate " +
                        "GROUP BY bt.hotel.hotelID, bt.hotel.hotelName " +
                        "ORDER BY COUNT(bt) DESC")
        List<Object[]> getBookingCountsAndRevenueByHotelBetweenDate(LocalDate startDate, LocalDate endDate);

        @Query("SELECT bt.paymentMethod.methodId, bt.paymentMethod.methodName, COUNT(bt), SUM(bt.totalPrice) " +
                        "FROM BookingTransaction bt " +
                        "WHERE bt.bookingDate BETWEEN :startDate AND :endDate " +
                        "GROUP BY bt.paymentMethod.methodId, bt.paymentMethod.methodName " +
                        "ORDER BY COUNT(bt) DESC")
        List<Object[]> getBookingCountsAndRevenueByPaymentMethod(LocalDate startDate, LocalDate endDate);

        @Query("SELECT bt.bookingDate, COUNT(bt), SUM(bt.totalPrice) " +
                        "FROM BookingTransaction bt " +
                        "WHERE bt.bookingDate BETWEEN :startDate AND :endDate " +
                        "GROUP BY bt.bookingDate " +
                        "ORDER BY bt.bookingDate")
        List<Object[]> getDailyBookingSummary(LocalDate startDate, LocalDate endDate);

        // Payment status queries
        @Query("SELECT bt.isPaid, COUNT(bt) FROM BookingTransaction bt " +
                        "WHERE bt.bookingDate BETWEEN :startDate AND :endDate " +
                        "GROUP BY bt.isPaid")
        List<Object[]> getBookingCountsByPaymentStatusBetweenDate(LocalDate startDate, LocalDate endDate);

        // Hotel-specific filtering queries
        @Query("SELECT COUNT(bt), SUM(bt.totalPrice),SUM(bt.numberOfGuests),SUM(bt.numberOfRooms) " +
                        "FROM BookingTransaction bt " +
                        "WHERE bt.bookingDate BETWEEN :startDate AND :endDate AND bt.hotel.hotelID = :hotelId")
        List<Object[]> getTotalBookingsCountBetweenDateAndHotel(LocalDate startDate, LocalDate endDate, Long hotelId);

        @Query("SELECT new com.example.backend.dto.AdminDTO.DatabaseDTO.CountByStateDTO(bt.status, COUNT(bt)) " +
                        "FROM BookingTransaction bt " +
                        "WHERE bt.bookingDate BETWEEN :startDate AND :endDate AND bt.hotel.hotelID = :hotelId " +
                        "GROUP BY bt.status")
        List<CountByStateDTO> getBookingCountsByStatusBetweenDateAndHotel(LocalDate startDate, LocalDate endDate,
                        Long hotelId);

        @Query("SELECT bt.hotel.hotelID, bt.hotel.hotelName, COUNT(bt), SUM(bt.totalPrice) " +
                        "FROM BookingTransaction bt " +
                        "WHERE bt.bookingDate BETWEEN :startDate AND :endDate AND bt.hotel.hotelID = :hotelId " +
                        "GROUP BY bt.hotel.hotelID, bt.hotel.hotelName " +
                        "ORDER BY COUNT(bt) DESC")
        List<Object[]> getBookingCountsAndRevenueByHotelBetweenDateAndHotel(LocalDate startDate, LocalDate endDate,
                        Long hotelId);

        @Query("SELECT bt.paymentMethod.methodId, bt.paymentMethod.methodName, COUNT(bt), SUM(bt.totalPrice) " +
                        "FROM BookingTransaction bt " +
                        "WHERE bt.bookingDate BETWEEN :startDate AND :endDate AND bt.hotel.hotelID = :hotelId " +
                        "GROUP BY bt.paymentMethod.methodId, bt.paymentMethod.methodName " +
                        "ORDER BY COUNT(bt) DESC")
        List<Object[]> getBookingCountsAndRevenueByPaymentMethodAndHotel(LocalDate startDate, LocalDate endDate,
                        Long hotelId);

        @Query("SELECT bt.bookingDate, COUNT(bt), SUM(bt.totalPrice) " +
                        "FROM BookingTransaction bt " +
                        "WHERE bt.bookingDate BETWEEN :startDate AND :endDate AND bt.hotel.hotelID = :hotelId " +
                        "GROUP BY bt.bookingDate " +
                        "ORDER BY bt.bookingDate")
        List<Object[]> getDailyBookingSummaryByHotel(LocalDate startDate, LocalDate endDate, Long hotelId);

        @Query("SELECT bt.isPaid, COUNT(bt) FROM BookingTransaction bt " +
                        "WHERE bt.bookingDate BETWEEN :startDate AND :endDate AND bt.hotel.hotelID = :hotelId " +
                        "GROUP BY bt.isPaid")
        List<Object[]> getBookingCountsByPaymentStatusBetweenDateAndHotel(LocalDate startDate, LocalDate endDate,
                        Long hotelId);

        @Query("SELECT bt From BookingTransaction bt WHERE bt.bookingDate BETWEEN :startDate AND :endDate ")
        List<BookingTransaction> getBookingBetweenDate(LocalDate startDate, LocalDate endDate);

        @Query("SELECT bt From BookingTransaction bt WHERE bt.bookingDate BETWEEN :startDate AND :endDate AND bt.hotel.hotelID = :hotelId  ")
        List<BookingTransaction> getBookingBetweenDateForHotel(LocalDate startDate, LocalDate endDate, Long hotelId);

        @Query("SELECT bt From BookingTransaction bt WHERE bt.status = 'PENDING' AND bt.checkIn < :nowDate + :days ")
        List<BookingTransaction> getPendingBookingThatCheckedInAfterDays(LocalDate nowDate, int days);

        @Query("UPDATE BookingTransaction bt SET bt.status = 'CANCELLED' WHERE bt.status = 'PENDING' AND bt.checkIn < :nowDate + :days ")
        void updatePendingBookingThatCheckedInAfterDays(LocalDate nowDate, int days);

        @Query("SELECT bt FROM BookingTransaction bt WHERE bt.user.userID = :userId AND bt.checkIn >= CURRENT_DATE ORDER BY bt.checkIn ASC")
        List<BookingTransaction> findUpcomingBookingsByUserId(@Param("userId") Integer userId);

        @Query("SELECT bt FROM BookingTransaction bt WHERE bt.user.userID = :userId AND bt.checkOut < CURRENT_DATE ORDER BY bt.checkOut ASC")
        List<BookingTransaction> findPastBookingsByUserId(@Param("userId") Integer userId);

}

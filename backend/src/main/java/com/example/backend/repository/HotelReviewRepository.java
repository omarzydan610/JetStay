package com.example.backend.repository;

import com.example.backend.dto.HotelDTO.HotelReviewItemDTO;
import com.example.backend.dto.HotelDTO.HotelReviewSummaryDTO;
import com.example.backend.entity.HotelReview;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface HotelReviewRepository extends JpaRepository<HotelReview, Integer> {

    boolean existsByBookingTransaction_BookingTransactionId(Integer bookingTransactionId);

    Optional<HotelReview> findByBookingTransaction_BookingTransactionId(Integer bookingTransactionId);

    @Query("""
        SELECT new com.example.backend.dto.HotelDTO.HotelReviewSummaryDTO(
            AVG(r.staffRate),
            AVG(r.comfortRate),
            AVG(r.facilitiesRate),
            AVG(r.cleanlinessRate),
            AVG(r.valueForMoneyRate),
            AVG(r.locationRate)
        )
        FROM HotelReview r
        WHERE r.hotel.hotelID = :hotelId
    """)
    HotelReviewSummaryDTO getHotelReviewSummary(@Param("hotelId") Integer hotelId);

    @Query("""
        SELECT new com.example.backend.dto.HotelDTO.HotelReviewItemDTO(
            u.firstName,
            rt.roomTypeName,
            DATEDIFF(rb.checkOut, rb.checkIn),
            r.rating,
            r.comment,
            r.createdAt
        )
        FROM HotelReview r
        JOIN r.user u
        JOIN RoomBooking rb ON rb.bookingTransaction.bookingTransactionId = r.bookingTransaction.bookingTransactionId
        JOIN rb.roomType rt
        WHERE r.hotel.hotelID = :hotelId
    """)
    Page<HotelReviewItemDTO> getHotelReviews(
            @Param("hotelId") Integer hotelId,
            Pageable pageable
    );

    @Query("""
        SELECT COALESCE(AVG(r.rating), 0.0)
        FROM HotelReview r
        WHERE r.hotel.hotelID = :hotelId
    """)
    Double calculateHotelAverageRate(@Param("hotelId") Integer hotelId);
}

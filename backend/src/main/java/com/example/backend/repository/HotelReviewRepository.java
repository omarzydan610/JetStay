package com.example.backend.repository;

import com.example.backend.dto.AdminDashboard.FlaggedReviewDTO;
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
        WHERE r.hotel.hotelID = :hotelId AND r.toxicFlag = false
    """)
    HotelReviewSummaryDTO getHotelReviewSummary(@Param("hotelId") Integer hotelId);

    @Query(value = """
        SELECT 
        CONCAT(u.first_name, ' ', u.last_name) AS userName,
        rt.room_type_name AS roomType,
        DATEDIFF(rb.check_out, rb.check_in) AS nights,
        r.rating,
        r.comment,
        r.created_at AS createdAt
        FROM hotel_reviews r
        JOIN users u ON r.user_id = u.user_id
        JOIN room_booking rb ON rb.booking_transaction_id = r.booking_transaction_id
        JOIN room_types rt ON rb.room_type_id = rt.room_type_id
        WHERE r.hotel_id = :hotelId AND r.toxic_flag = false
        ORDER BY r.created_at DESC """,

            countQuery = """
        SELECT COUNT(*) 
        FROM hotel_review r
        WHERE r.hotel_id = :hotelId
        """,
            nativeQuery = true)
    Page<HotelReviewItemDTO> getHotelReviews(
            @Param("hotelId") Integer hotelId,
            Pageable pageable
    );

    @Query("""
        SELECT COALESCE(AVG(r.rating), 0.0)
        FROM HotelReview r
        WHERE r.hotel.hotelID = :hotelId AND r.toxicFlag = false
    """)
    Double calculateHotelAverageRate(@Param("hotelId") Integer hotelId);

    @Query("""
        SELECT new com.example.backend.dto.AdminDashboard.FlaggedReviewDTO(
            r.reviewId,
            r.comment,
            r.rating,
            r.createdAt,
            CONCAT(u.firstName, ' ', u.lastName),
            h.hotelName
        )
        FROM HotelReview r
        JOIN r.user u
        JOIN r.hotel h
        WHERE r.toxicFlag = true
    """)
    Page<FlaggedReviewDTO> findFlaggedReviews(Pageable pageable);
}

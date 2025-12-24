package com.example.backend.repository;


import com.example.backend.dto.AirlineDTO.AirlineReviewItemDTO;
import com.example.backend.dto.AirlineDTO.AirlineReviewSummaryDTO;
import com.example.backend.entity.FlightReview;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FlightReviewRepository extends JpaRepository<FlightReview, Integer> {

    @Query("SELECT fr.rating FROM FlightReview fr WHERE fr.flightId IN :flightIds")
    List<Float> findAllRatingsByFlightIds(@Param("flightIds") List<Integer> flightIds);

    @Query("SELECT fr.rating FROM FlightReview fr")
    List<Float> findAllRatings();

    boolean existsByTicket_TicketId(Integer ticketId);

    Optional<FlightReview> findByTicket_TicketId(Integer ticketId);

    @Query("""
        SELECT new com.example.backend.dto.AirlineDTO.AirlineReviewSummaryDTO(
            AVG(r.onTimeRate),
            AVG(r.comfortRate),
            AVG(r.amenitiesRate),
            AVG(r.staffRate)
        )
        FROM FlightReview r
        WHERE r.ticket.airline.airlineID = :airlineId
    """)
    AirlineReviewSummaryDTO getAirlineReviewSummary(@Param("airlineId") Integer airlineId);

    @Query("""
        SELECT new com.example.backend.dto.AirlineDTO.AirlineReviewItemDTO(
            CONCAT(u.firstName, ' ', u.lastName),
            tt.typeName,
            f.planeType,
            r.rating,
            r.comment,
            r.createdAt
        )
        FROM FlightReview r
        JOIN r.ticket t
        JOIN t.user u
        JOIN t.tripType tt
        JOIN t.flight f
        WHERE t.airline.airlineID = :airlineId AND r.toxicFlag = false
    """)
    Page<AirlineReviewItemDTO> getAirlineReviews(@Param("airlineId") Integer airlineId, Pageable pageable);

    @Query("""
        SELECT COALESCE(AVG(r.rating), 0.0)
        FROM FlightReview r
        WHERE r.ticket.airline.airlineID = :airlineId
    """)
    Double calculateAirlineAverageRate(@Param("airlineId") Integer airlineId);

}

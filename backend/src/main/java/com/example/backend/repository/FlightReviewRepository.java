package com.example.backend.repository;


import com.example.backend.entity.FlightReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FlightReviewRepository extends JpaRepository<FlightReview, Integer> {

    @Query("SELECT fr.rating FROM FlightReview fr WHERE fr.flightId IN :flightIds")
    List<Float> findAllRatingsByFlightIds(@Param("flightIds") List<Integer> flightIds);

    @Query("SELECT fr.rating FROM FlightReview fr")
    List<Float> findAllRatings();
}

package com.example.backend.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "flight_reviews")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FlightReview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "flight_review_id")
    private Integer id;

    @Column(name = "user_id", nullable = false)
    private Integer userId;

    @Column(name = "flight_id", nullable = false)
    private Integer flightId;

    @Column(name = "ticket_id", nullable = false)
    private Integer ticketId;

    @Column(nullable = false)
    private Float rating;

    @Column(length = 500)
    private String comment;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}


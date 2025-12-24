package com.example.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "hotel_reviews")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HotelReview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "review_id")
    private Integer reviewId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "hotel_id")
    private Hotel hotel;

    @OneToOne
    @JoinColumn(name = "booking_transaction_id")
    private BookingTransaction bookingTransaction;

    @Column(name = "rating", nullable = false)
    private Float rating;

    @Column(name = "comment")
    private String comment;

    @Min(1) @Max(5)
    @Column(name="staff_rate", nullable = false)
    private int staffRate;

    @Min(1) @Max(5)
    @Column(name="comfort_rate", nullable = false)
    private int comfortRate;

    @Min(1) @Max(5)
    @Column(name="facilities_rate", nullable = false)
    private int facilitiesRate;

    @Min(1) @Max(5)
    @Column(name="cleanliness_rate", nullable = false)
    private int cleanlinessRate;

    @Min(1) @Max(5)
    @Column(name="value_for_money_rate", nullable = false)
    private int valueForMoneyRate;

    @Min(1) @Max(5)
    @Column(name="locationRate", nullable = false)
    private int locationRate;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "toxic_flag")
    private boolean toxicFlag;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.rating = calculateAverageRating();
    }

    private float calculateAverageRating() {
        return (staffRate + comfortRate + facilitiesRate +
                cleanlinessRate + valueForMoneyRate + locationRate) / 6.0f;
    }
}

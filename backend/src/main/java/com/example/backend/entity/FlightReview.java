package com.example.backend.entity;


import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
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

    @OneToOne
    @JoinColumn(name = "ticket_id")
    private FlightTicket ticket;

    @Min(1) @Max(5)
    @Column(name="onTime_rate", nullable = false)
    private int onTimeRate;

    @Min(1) @Max(5)
    @Column(name="staff_rate", nullable = false)
    private int staffRate;

    @Min(1) @Max(5)
    @Column(name="comfort_rate", nullable = false)
    private int comfortRate;

    @Min(1) @Max(5)
    @Column(name="amenities_rate", nullable = false)
    private int amenitiesRate;

    @Column(nullable = false)
    private Float rating;

    @Column(length = 500)
    private String comment;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "toxic_flag")
    private Boolean toxicFlag;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}


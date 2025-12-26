package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "flight_offers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FlightOffer {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "flight_offer_id")
    private Integer flightOfferId;
    
    // @Column(name = "offer_code", unique = true, nullable = false)
    // private String offerCode;
    
    @Column(name = "offer_name", nullable = false)
    private String offerName;
    
    @Column(name = "discount_value", nullable = false)
    private Float discountValue;
    
    @OneToOne
    @JoinColumn(name = "flight_id")
    private Flight applicableFlight;
    
    @ManyToOne
    @JoinColumn(name = "applicable_airline_id")
    private Airline applicableAirline;
    
    @Column(name = "start_date", nullable = false)
    private LocalDateTime startDate;
    
    @Column(name = "end_date", nullable = false)
    private LocalDateTime endDate;
    
    @Column(name = "max_usage")
    private Integer maxUsage;
    
    @Column(name = "current_usage", nullable = false)
    private Integer currentUsage = 0;
    
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "description", length = 500)
    private String description;
    
    
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
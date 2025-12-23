package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "room_offers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoomOffer {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "room_offer_id")
    private Integer roomOfferId;
    
    // @Column(name = "offer_code", unique = true, nullable = false)
    // private String offerCode;
    
    @Column(name = "offer_name", nullable = false)
    private String offerName;
    
    @Column(name = "discount_value", nullable = false)
    private float discountValue;
    
    @ManyToOne
    @JoinColumn(name = "room_type_id")
    private RoomType applicableRoomType;
    
    @ManyToOne
    @JoinColumn(name = "applicable_hotel_id")
    private Hotel applicableHotel;
    
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
    
    @Column(name = "min_stay_nights")
    private Integer minStayNights;
    
    @Column(name = "min_booking_amount")
    private Float minBookingAmount;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "description", length = 500)
    private String description;
    
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "hotels")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Hotel {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "hotel_id")
  private Integer hotelID;

  @Column(name = "hotel_name")
  private String hotelName;

  @Column(name = "latitude")
  private Double latitude;

  @Column(name = "longitude")
  private Double longitude;

  @Column(name = "city")
  private String city;

  @Column(name = "country")
  private String country;

  @Column(name = "hotel_rate")
  private Float hotelRate;

  @Column(name = "number_of_rates")
  private Integer numberOfRates;

  @ManyToOne
  @JoinColumn(name = "admin_id")
  private User admin;

  @Column(name = "created_at", nullable = false)
  private LocalDateTime createdAt;

  @PrePersist
  protected void onCreate() {
    createdAt = LocalDateTime.now();
  }
}

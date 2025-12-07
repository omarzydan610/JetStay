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

  @Column(name = "hotel_name", nullable = false)
  private String hotelName;

  @Column(name = "latitude", nullable = false)
  private Double latitude;

  @Column(name = "longitude", nullable = false)
  private Double longitude;

  @Column(name = "city", nullable = false)
  private String city;

  @Column(name = "country", nullable = false)
  private String country;

  @Column(name = "hotel_rate")
  private Float hotelRate;

  @Column(name = "number_of_rates")
  private Integer numberOfRates;

  @OneToOne
  @JoinColumn(name = "admin_id", nullable = false)
  private User admin;

  @Column(name = "created_at", nullable = false)
  private LocalDateTime createdAt;

  @Column(name = "logo_url")
  private String logoUrl;

  @Enumerated(EnumType.STRING)
  @Column(name = "status", nullable = false)
  private Status status;

  public enum Status {
    ACTIVE,
    INACTIVE
  }

  @PrePersist
  protected void onCreate() {
    this.status = Status.INACTIVE;
    this.createdAt = LocalDateTime.now();
  }
}

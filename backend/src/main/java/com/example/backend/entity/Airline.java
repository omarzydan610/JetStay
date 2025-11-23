package com.example.backend.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "airlines")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Airline {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "airline_id")
  private Integer airlineID;

  @Column(name = "airline_name", nullable = false)
  private String airlineName;

  @Column(name = "airline_rate")
  private Float airlineRate;

  @Column(name = "number_of_rates")
  private Integer numberOfRates;

  @Column(name = "airline_nationality", nullable = false)
  private String airlineNationality;

  @ManyToOne
  @JoinColumn(name = "admin_id", nullable = false)
  private User admin;

  @Column(name = "logo_url")
  private String logoUrl;

  @Column(name = "created_at", nullable = false)
  private LocalDateTime createdAt;

  @PrePersist
  protected void onCreate() {
    createdAt = LocalDateTime.now();
  }
}

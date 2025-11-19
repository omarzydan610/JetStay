package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "flights")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Flight {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "flight_id")
  private Integer flightID;

  @ManyToOne
  @JoinColumn(name = "airline_id")
  private Airline airline;

  @ManyToOne
  @JoinColumn(name = "departure_airport_id")
  private Airport departureAirport;

  @ManyToOne
  @JoinColumn(name = "arrival_airport_id")
  private Airport arrivalAirport;

  @Column(name = "departure_date")
  private LocalDateTime departureDate;

  @Column(name = "arrival_date")
  private LocalDateTime arrivalDate;

  @Enumerated(EnumType.STRING)
  @Column(name = "status")
  private FlightStatus status;

  @Column(name = "description")
  private String description;

  @Column(name = "planeType")
  private String planeType;

  public enum FlightStatus {
    PENDING, ON_TIME, CANCELLED
  }
}

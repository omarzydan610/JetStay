package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

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

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "airline_id", nullable = false)
  private Airline airline;

  @ManyToOne
  @JoinColumn(name = "departure_airport_id", nullable = false)
  private Airport departureAirport;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "arrival_airport_id", nullable = false)
  private Airport arrivalAirport;

  @Column(name = "departure_date", nullable = false)
  private LocalDateTime departureDate;

  @Column(name = "arrival_date", nullable = false)
  private LocalDateTime arrivalDate;

  @Enumerated(EnumType.STRING)
  @Column(name = "status", nullable = false)
  private FlightStatus status;

  @Column(name = "description")
  private String description;

  @Column(name = "plane_type")
  private String planeType;


  @OneToMany(mappedBy = "flight", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  private List<TripType> tripsTypes;

  public enum FlightStatus {
    PENDING, ON_TIME, CANCELLED
  }

}

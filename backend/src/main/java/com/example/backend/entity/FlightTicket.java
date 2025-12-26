package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "flight_tickets")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FlightTicket {

    public FlightTicket(
            Integer ticketId,
            Flight flight,
            Airline airline,
            LocalDate flightDate,
            User user,
            TripType tripType,
            Float price,
            Boolean isPaid) {
        this.ticketId = ticketId;
        this.flight = flight;
        this.airline = airline;
        this.flightDate = flightDate;
        this.user = user;
        this.tripType = tripType;
        this.price = price;
        this.isPaid = isPaid;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ticket_id")
    private Integer ticketId;

    @ManyToOne
    @JoinColumn(name = "flight_id")
    private Flight flight;

    @ManyToOne
    @JoinColumn(name = "airline_id")
    private Airline airline;

    @Column(name = "flight_date")
    private LocalDate flightDate;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "trip_type_id")
    private TripType tripType;

    @Column(name = "price")
    private Float price;

    @Column(name = "is_paid")
    private Boolean isPaid;

    @Enumerated(EnumType.STRING)
    @Column(name = "state")
    private TicketState state;

    @Column(name = "created_at")
    private LocalDate createdAt;

    @ManyToOne
    @JoinColumn(name = "applied_offer_id")
    private FlightOffer appliedOffer;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDate.now();
        this.state = TicketState.PENDING;
        this.isPaid = false;
    }

    public enum TicketState {

        PENDING,
        COMPLETED,
        CANCELLED,
    }

}
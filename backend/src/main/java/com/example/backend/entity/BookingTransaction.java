package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "booking_transaction")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "booking_transaction_id")
    private Integer bookingTransactionId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "hotel_id")
    private Hotel hotel;

    @Column(name = "total_price")
    private Float totalPrice;

    @ManyToOne
    @JoinColumn(name = "payment_method")
    private PaymentMethod paymentMethod;

    @Column(name = "is_paid")
    private Boolean isPaid;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private Status status;

    @Column(name = "number_of_guests")
    private Integer numberOfGuests;

    @Column(name = "number_of_rooms")
    private Integer numberOfRooms;

    @ManyToOne
    @JoinColumn(name = "amenitie_id")
    private HotelAmenity amenitie;

    @Column(name = "check_in")
    private LocalDate checkIn;

    @Column(name = "check_out")
    private LocalDate checkOut;

    @Column(name = "booking_date")
    private LocalDate bookingDate;

    @ManyToOne
    @JoinColumn(name = "applied_offer_id")
    private RoomOffer appliedOffer;


    public enum Status {
        PENDING,
        CONFIRMED,
        CANCELLED,
        COMPLETED
    }

    @PrePersist
    protected void onCreate() {
        this.bookingDate = LocalDate.now();
        this.isPaid = false;
        this.status = Status.PENDING;
    }
}

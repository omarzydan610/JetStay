package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payment_id")
    private Integer paymentId;

    @ManyToOne
    @JoinColumn(name = "booking_transaction_id")
    private BookingTransaction bookingTransaction;

    @ManyToOne
    @JoinColumn(name = "method_id")
    private PaymentMethod method;

    @Column(name = "amount")
    private Float amount;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private Status status;

    @Column(name = "payment_date")
    private LocalDateTime paymentDate;

    public enum Status {
        PENDING,
        COMPLETED,
        FAILED
    }

    @PrePersist
    protected void onCreate() {
        this.paymentDate = LocalDateTime.now();
        this.status = Status.PENDING;
    }
}

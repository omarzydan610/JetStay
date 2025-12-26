package com.example.backend.dto.PaymentDTO;

import com.example.backend.entity.BookingTransaction;
import com.example.backend.entity.PaymentMethod;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
public class RoomPaymentDTO {
    // Stripe
    private String paymentMethod;   // Stripe PaymentMethod ID
    private Float amount;
    private String currency;
    private String description;

    // Internal DB details
    private Integer bookingTransactionId;
    private Integer methodId;
    private Integer userId;
}

package com.example.backend.dto.PaymentDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class StripeDTO {
    // Stripe
    private String paymentMethodID;   // Stripe PaymentMethod ID
    private Float amount;
    private String currency;
    private String description;
}

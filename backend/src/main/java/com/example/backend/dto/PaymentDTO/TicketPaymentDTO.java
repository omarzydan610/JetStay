package com.example.backend.dto.PaymentDTO;

import com.example.backend.entity.PaymentMethod;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class TicketPaymentDTO {

    // Stripe
    private String paymentMethod;   // Stripe PaymentMethod ID
    private Float amount;
    private String currency;
    private String description;

    // Internal DB details
    private List<Integer> ticketIds;
    private Integer methodId;
    private Integer userId;
}

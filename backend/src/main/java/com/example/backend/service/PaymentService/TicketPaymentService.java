package com.example.backend.service.PaymentService;

import com.example.backend.dto.PaymentDTO.TicketPaymentDTO;
import com.example.backend.dto.PaymentDTO.StripeDTO;
import com.example.backend.entity.FlightTicket;
import com.example.backend.entity.PaymentMethod;
import com.example.backend.entity.TicketPayment;
import com.example.backend.repository.FlightTicketRepository;
import com.example.backend.repository.PaymentMethodRepository;
import com.example.backend.repository.TicketPaymentRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class TicketPaymentService {

    @Autowired
    private TicketPaymentRepository ticketPaymentRepository;

    @Autowired
    private FlightTicketRepository flightTicketRepository;

    @Autowired
    private PaymentMethodRepository paymentMethodRepository;

    private final RestTemplate restTemplate = new RestTemplate();
    private final String FASTAPI_URL = "http://localhost:8000/api/payment/pay";

    public ResponseEntity<String> pay(TicketPaymentDTO dto) {

        // Validate FlightTicket
        FlightTicket ticket = flightTicketRepository.findById(dto.getTicketId())
                .orElse(null);
        if (ticket.equals(null)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("{\"status\":\"failed\",\"error\":\"Flight ticket not found\"}");
        }

        if (ticket.getIsPaid().equals(true)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("{\"status\":\"failed\",\"error\":\"Flight ticket was just purchased moments before\"}");
        }

        // Validate PaymentMethod
        PaymentMethod method = paymentMethodRepository.findById(dto.getMethodId())
                .orElse(null);
        if (method == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("{\"status\":\"failed\",\"error\":\"Payment method not found\"}");
        }

        // Convert to Stripe DTO
        StripeDTO stripeDTO = StripeDTO.builder()
                .paymentMethodID(dto.getPaymentMethod())
                .amount(dto.getAmount())
                .currency(dto.getCurrency())
                .description(dto.getDescription())
                .build();

        // Save initial payment as PENDING
        TicketPayment payment = new TicketPayment();
        payment.setTicket(ticket);
        payment.setMethod(method);
        payment.setAmount(dto.getAmount());
        payment.setStatus(TicketPayment.Status.PENDING);
        ticketPaymentRepository.save(payment);
        Integer paymentID = payment.getPaymentId();

        ResponseEntity<String> fastApiResponse;
        boolean success = false;

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<StripeDTO> request = new HttpEntity<>(stripeDTO, headers);

            fastApiResponse = restTemplate.postForEntity(
                    FASTAPI_URL,
                    request,
                    String.class
            );

            success = fastApiResponse.getStatusCode().is2xxSuccessful();

            if (success){
                ticket.setIsPaid(true);
                flightTicketRepository.save(ticket);
            }


        } catch (Exception e) {
            fastApiResponse = ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"status\":\"failed\",\"error\":\"" + e.getMessage() + "\"}");
        }

        // Update payment status
        confirmPayment(paymentID, success);

        return fastApiResponse;
    }

    private void confirmPayment(Integer paymentID, boolean success) {
        if (paymentID == null) return;

        TicketPayment payment = ticketPaymentRepository.findById(paymentID).orElse(null);
        if (payment == null) return;

        payment.setStatus(success ? TicketPayment.Status.COMPLETED : TicketPayment.Status.FAILED);
        ticketPaymentRepository.save(payment);
    }
}
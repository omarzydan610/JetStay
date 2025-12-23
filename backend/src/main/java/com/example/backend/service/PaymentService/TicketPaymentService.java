package com.example.backend.service.PaymentService;

import com.example.backend.config.StripeResponseErrorHandler;
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
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.ResponseErrorHandler;

import java.io.IOException;

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

    public TicketPaymentService() {
        restTemplate.setErrorHandler(new StripeResponseErrorHandler());
    }

    public ResponseEntity<String> pay(TicketPaymentDTO dto) {

        FlightTicket ticket = flightTicketRepository.findById(dto.getTicketId()).orElse(null);
        if (ticket == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("{\"status\":\"failed\",\"error\":\"Flight ticket not found\"}");
        }

        if (Boolean.TRUE.equals(ticket.getIsPaid())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("{\"status\":\"failed\",\"error\":\"Flight ticket was just purchased moments before\"}");
        }

        PaymentMethod method = paymentMethodRepository.findById(dto.getMethodId()).orElse(null);
        if (method == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("{\"status\":\"failed\",\"error\":\"Payment method not found\"}");
        }

        StripeDTO stripeDTO = StripeDTO.builder()
                .paymentMethodID(dto.getPaymentMethod())
                .amount(dto.getAmount())
                .currency(dto.getCurrency())
                .description(dto.getDescription())
                .build();

        TicketPayment payment = new TicketPayment();
        payment.setTicket(ticket);
        payment.setMethod(method);
        payment.setAmount(dto.getAmount());
        payment.setStatus(TicketPayment.Status.PENDING);
        ticketPaymentRepository.save(payment);
        Integer paymentID = payment.getPaymentId();

        ResponseEntity<String> fastApiResponse;

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<StripeDTO> request = new HttpEntity<>(stripeDTO, headers);

            fastApiResponse = restTemplate.postForEntity(FASTAPI_URL, request, String.class);

            // Determine success by parsing JSON "status" field manually
            boolean success = fastApiResponse.getBody() != null && fastApiResponse.getBody().contains("\"status\":\"succeeded\"");

            if (success) {
                ticket.setIsPaid(true);
                flightTicketRepository.save(ticket);
            }

            confirmPayment(paymentID, success);

        } catch (Exception e) {
            fastApiResponse = ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"status\":\"failed\",\"error\":\"" + e.getMessage() + "\"}");
            confirmPayment(paymentID, false);
        }

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
package com.example.backend.service.PaymentService;

import com.example.backend.config.StripeResponseErrorHandler;
import com.example.backend.dto.PaymentDTO.TicketPaymentDTO;
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

    private final RestTemplate restTemplate;
    private final String STRIPE_URL = "http://localhost:8000/api/payment/pay/ticket";
    private final String PAYPAL_URL = "http://localhost:8000/api/payment/paypal/ticket";

    public TicketPaymentService() {
        this.restTemplate = new RestTemplate();
        this.restTemplate.setErrorHandler(new StripeResponseErrorHandler());
    }

    public ResponseEntity<String> pay(TicketPaymentDTO dto) {
        return processPayment(dto, STRIPE_URL);
    }

    public ResponseEntity<String> payPayPal(TicketPaymentDTO dto) {
        return processPayment(dto, PAYPAL_URL);
    }

    private ResponseEntity<String> processPayment(TicketPaymentDTO dto, String apiUrl) {
        // Validate ticket
        FlightTicket ticket = flightTicketRepository.findById(dto.getTicketId()).orElse(null);
        if (ticket == null) return badResponse("Flight ticket not found", HttpStatus.BAD_REQUEST);

        if (Boolean.TRUE.equals(ticket.getIsPaid())) {
            return badResponse("Flight ticket was just purchased moments before", HttpStatus.CONFLICT);
        }

        // Validate payment method
        PaymentMethod method = paymentMethodRepository.findById(dto.getMethodId()).orElse(null);
        if (method == null) return badResponse("Payment method not found", HttpStatus.BAD_REQUEST);

        boolean success = false;
        ResponseEntity<String> fastApiResponse;

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<TicketPaymentDTO> request = new HttpEntity<>(dto, headers);

            fastApiResponse = restTemplate.postForEntity(apiUrl, request, String.class);

            // Determine success by parsing JSON "status" field manually
            success = fastApiResponse.getBody() != null && fastApiResponse.getBody().contains("\"status\":\"succeeded\"");

            if (success) {
                ticket.setIsPaid(true);
                flightTicketRepository.save(ticket);
            }

        } catch (Exception e) {
            fastApiResponse = badResponse("Payment failed: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
            success = false;
        }

        // Optionally confirm payment in DB if paymentID exists
        confirmPayment(null, success);

        return fastApiResponse;
    }

    private void confirmPayment(Integer paymentID, boolean success) {
        if (paymentID == null) return;

        TicketPayment payment = ticketPaymentRepository.findById(paymentID).orElse(null);
        if (payment == null) return;

        payment.setStatus(success ? TicketPayment.Status.COMPLETED : TicketPayment.Status.FAILED);
        ticketPaymentRepository.save(payment);
    }

    private ResponseEntity<String> badResponse(String message, HttpStatus status) {
        return ResponseEntity.status(status)
                .body("{\"status\":\"failed\",\"error\":\"" + message + "\"}");
    }
}
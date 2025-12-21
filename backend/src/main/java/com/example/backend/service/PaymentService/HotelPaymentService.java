package com.example.backend.service.PaymentService;

import com.example.backend.dto.PaymentDTO.RoomPaymentDTO;
import com.example.backend.dto.PaymentDTO.StripeDTO;
import com.example.backend.entity.BookingTransaction;
import com.example.backend.entity.PaymentMethod;
import com.example.backend.entity.RoomPayment;
import com.example.backend.repository.BookingTransactionRepository;
import com.example.backend.repository.PaymentMethodRepository;

import com.example.backend.repository.RoomPaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class HotelPaymentService {

    @Autowired
    private RoomPaymentRepository roomPaymentRepository;

    @Autowired
    private BookingTransactionRepository bookingTransactionRepository;

    @Autowired
    private PaymentMethodRepository paymentMethodRepository;

    private final RestTemplate restTemplate = new RestTemplate();
    private final String FASTAPI_URL = "http://localhost:8000/api/payment/pay"; // same FastAPI endpoint

    public ResponseEntity<String> pay(RoomPaymentDTO dto) {

        // Validate booking transaction
        BookingTransaction booking = bookingTransactionRepository.findById(dto.getBookingTransactionId())
                .orElse(null);
        if (booking == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("{\"status\":\"failed\",\"error\":\"Booking transaction not found\"}");
        }

        if (booking.getIsPaid() != null && booking.getIsPaid()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("{\"status\":\"failed\",\"error\":\"Booking was just paid moments before\"}");
        }

        // Validate payment method
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
        RoomPayment payment = new RoomPayment();
        payment.setBookingTransaction(booking);
        payment.setMethod(method);
        payment.setAmount(dto.getAmount());
        payment.setStatus(RoomPayment.Status.PENDING);
        roomPaymentRepository.save(payment);
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

            if (success) {
                booking.setIsPaid(true);
                bookingTransactionRepository.save(booking);
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

        RoomPayment payment = roomPaymentRepository.findById(paymentID).orElse(null);
        if (payment == null) return;

        payment.setStatus(success ? RoomPayment.Status.COMPLETED : RoomPayment.Status.FAILED);
        roomPaymentRepository.save(payment);
    }
}
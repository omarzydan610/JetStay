package com.example.backend.service.PaymentService;

import com.example.backend.config.StripeResponseErrorHandler;
import com.example.backend.dto.PaymentDTO.RoomPaymentDTO;
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

    private final RestTemplate restTemplate;
    private final String STRIPE_URL = "http://localhost:8000/api/payment/pay/room";
    private final String PAYPAL_URL = "http://localhost:8000/api/payment/paypal/room";

    public HotelPaymentService() {
        this.restTemplate = new RestTemplate();
        this.restTemplate.setErrorHandler(new StripeResponseErrorHandler());
    }

    public ResponseEntity<String> pay(RoomPaymentDTO dto) {
        return processPayment(dto, STRIPE_URL);
    }

        public ResponseEntity<String> payPayPal(RoomPaymentDTO dto) {
        return processPayment(dto, PAYPAL_URL);
    }

    private ResponseEntity<String> processPayment(RoomPaymentDTO dto, String apiUrl) {
        // Validate booking transaction
        BookingTransaction booking = bookingTransactionRepository.findById(dto.getBookingTransactionId())
                .orElse(null);
        if (booking == null) {
            return badResponse("Booking transaction not found", HttpStatus.BAD_REQUEST);
        }

        if (Boolean.TRUE.equals(booking.getIsPaid())) {
            return badResponse("Booking was just paid moments before", HttpStatus.CONFLICT);
        }

        // Validate payment method
        PaymentMethod method = paymentMethodRepository.findById(dto.getMethodId()).orElse(null);
        if (method == null) {
            return badResponse("Payment method not found", HttpStatus.BAD_REQUEST);
        }

        boolean success = false;
        ResponseEntity<String> fastApiResponse;

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<RoomPaymentDTO> request = new HttpEntity<>(dto, headers);

            fastApiResponse = restTemplate.postForEntity(apiUrl, request, String.class);
            success = fastApiResponse.getStatusCode().is2xxSuccessful();

            if (success) {
                booking.setIsPaid(true);
                bookingTransactionRepository.save(booking);
            }

        } catch (Exception e) {
            fastApiResponse = badResponse("Payment failed: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }

        // Optionally update RoomPayment status if paymentID is provided
        confirmPayment(null, success);

        return fastApiResponse;
    }

    private void confirmPayment(Integer paymentID, boolean success) {
        if (paymentID == null) return;

        RoomPayment payment = roomPaymentRepository.findById(paymentID).orElse(null);
        if (payment == null) return;

        payment.setStatus(success ? RoomPayment.Status.COMPLETED : RoomPayment.Status.FAILED);
        roomPaymentRepository.save(payment);
    }

    private ResponseEntity<String> badResponse(String message, HttpStatus status) {
        return ResponseEntity.status(status)
                .body("{\"status\":\"failed\",\"error\":\"" + message + "\"}");
    }
}
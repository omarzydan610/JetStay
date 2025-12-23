package com.example.backend.controller.PaymentController;

import com.example.backend.dto.PaymentDTO.TicketPaymentDTO;
import com.example.backend.dto.PaymentDTO.RoomPaymentDTO;
import com.example.backend.service.AuthService.JwtAuthService;
import com.example.backend.service.PaymentService.TicketPaymentService;
import com.example.backend.service.PaymentService.HotelPaymentService;
import com.example.backend.entity.User;
import com.example.backend.repository.UserRepository;
import com.example.backend.exception.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @Autowired
    private TicketPaymentService ticketPaymentService;

    @Autowired
    private HotelPaymentService hotelPaymentService;

    @Autowired
    private JwtAuthService jwtAuthService;

    @Autowired
    private UserRepository userRepository;

    // Ticket payment
    @PostMapping("/pay/ticket")
    public ResponseEntity<String> payTicket(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestBody TicketPaymentDTO ticketPaymentDTO) {

        User user = authenticateAndValidateUser(authorizationHeader);
        ticketPaymentDTO.setUserId(user.getUserID());

        ResponseEntity<String> fastApiResponse = ticketPaymentService.pay(ticketPaymentDTO);
        return ResponseEntity
                .status(fastApiResponse.getStatusCode())
                .body(fastApiResponse.getBody());
    }

    // Room payment
    @PostMapping("/pay/room")
    public ResponseEntity<String> payRoom(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestBody RoomPaymentDTO roomPaymentDTO) {

        User user = authenticateAndValidateUser(authorizationHeader);
        roomPaymentDTO.setUserId(user.getUserID());

        ResponseEntity<String> fastApiResponse = hotelPaymentService.pay(roomPaymentDTO);
        return ResponseEntity
                .status(fastApiResponse.getStatusCode())
                .body(fastApiResponse.getBody());
    }

    // Common method for authentication and userId validation
    private User authenticateAndValidateUser(String authorizationHeader) {
        String token = jwtAuthService.extractTokenFromHeader(authorizationHeader);
        String userEmail = jwtAuthService.extractEmail(token);

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new BadRequestException("User not found"));

        if (user.getRole() != User.UserRole.CLIENT) {
            throw new BadRequestException("User is not allowed to make payments");
        }

        return user;
    }
}
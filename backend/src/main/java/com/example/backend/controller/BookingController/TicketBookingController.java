package com.example.backend.controller.BookingController;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.Authentication;
import com.example.backend.dto.BookingDTOs.TicketBookingRequest;
import com.example.backend.dto.response.SuccessResponse;
import com.example.backend.service.BookingService.TicketBookingService;

import io.jsonwebtoken.Claims;

@RestController
public class TicketBookingController {

    @Autowired
    private TicketBookingService ticketBookingService;

    @PostMapping("/book-ticket")
    public ResponseEntity<SuccessResponse<Integer[]>> bookTicket(@RequestBody TicketBookingRequest ticketBookingRequest) {
        Integer userId = getUserId();   
        Integer[] ticketIds = ticketBookingService.ticketBookingService(ticketBookingRequest, userId);
        return ResponseEntity.ok(SuccessResponse.of("Ticket booked successfully", ticketIds));
    }

    private Integer getUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Claims claims = (Claims) auth.getCredentials();
        return claims.get("user_id", Integer.class);
    }
}

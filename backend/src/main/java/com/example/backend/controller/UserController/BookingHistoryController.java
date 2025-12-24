package com.example.backend.controller.UserController;

import com.example.backend.dto.BookingDTO.BookingResponse;
import com.example.backend.dto.response.SuccessResponse;
import com.example.backend.service.BookingHistoryService.BookingHistoryService;

import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingHistoryController {

    @Autowired
    private BookingHistoryService bookingService;

    @GetMapping("/history")
    public ResponseEntity<?> getBookingHistory() {
        Integer userId = getCurrentUserId();
        List<BookingResponse> history = bookingService.getBookingHistory(userId);
        return ResponseEntity.ok(SuccessResponse.of("Booking history retrieved successfully", history));
    }

    @GetMapping("/upcoming")
    public ResponseEntity<?> getUpcomingBookings() {
        Integer userId = getCurrentUserId();
        List<BookingResponse> upcoming = bookingService.getUpcomingBookings(userId);
        return ResponseEntity.ok(SuccessResponse.of("Upcoming bookings retrieved successfully", upcoming));
    }

    @GetMapping("/{bookingId}")
    public ResponseEntity<?> getBookingDetails(@PathVariable Integer bookingId) {
        BookingResponse booking = bookingService.getBookingDetails(bookingId);
        return ResponseEntity.ok(SuccessResponse.of("Booking details retrieved successfully", booking));
    }


    private Integer getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Claims claims = (Claims) auth.getCredentials();
        return claims.get("user_id", Integer.class);
    }
}

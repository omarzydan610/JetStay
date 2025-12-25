package com.example.backend.controller.UserController;

import com.example.backend.dto.BookingDTOs.FlightTicketResponse;
import com.example.backend.dto.BookingDTOs.HotelBookingResponse;
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

    // ==================== Hotel Booking Endpoints ====================

    @GetMapping("/hotel/history")
    public ResponseEntity<?> getBookingHistory() {
        Integer userId = getCurrentUserId();
        System.out.println(". a a a a a a a userId: " + userId);
        List<HotelBookingResponse> history = bookingService.getBookingHistory(userId);
        return ResponseEntity.ok(SuccessResponse.of("Booking history retrieved successfully", history));
    }

    @GetMapping("/hotel/upcoming")
    public ResponseEntity<?> getUpcomingBookings() {
        Integer userId = getCurrentUserId();
        List<HotelBookingResponse> upcoming = bookingService.getUpcomingBookings(userId);
        return ResponseEntity.ok(SuccessResponse.of("Upcoming bookings retrieved successfully", upcoming));
    }

    @GetMapping("/hotel/{bookingId}")
    public ResponseEntity<?> getBookingDetails(@PathVariable Integer bookingId) {
        HotelBookingResponse booking = bookingService.getBookingDetails(bookingId);
        return ResponseEntity.ok(SuccessResponse.of("Booking details retrieved successfully", booking));
    }

    // ==================== Flight Ticket Endpoints ====================

    @GetMapping("/flight/history")
    public ResponseEntity<?> getFlightTicketHistory() {
        Integer userId = getCurrentUserId();
        List<FlightTicketResponse> history = bookingService.getFlightTicketHistory(userId);
        return ResponseEntity.ok(SuccessResponse.of("Flight ticket history retrieved successfully", history));
    }

    @GetMapping("/flight/upcoming")
    public ResponseEntity<?> getUpcomingFlightTickets() {
        Integer userId = getCurrentUserId();
        List<FlightTicketResponse> upcoming = bookingService.getUpcomingFlightTickets(userId);
        return ResponseEntity.ok(SuccessResponse.of("Upcoming flight tickets retrieved successfully", upcoming));
    }

    @GetMapping("/flight/{ticketId}")
    public ResponseEntity<?> getFlightTicketDetails(@PathVariable Integer ticketId) {
        FlightTicketResponse ticket = bookingService.getFlightTicketDetails(ticketId);
        return ResponseEntity.ok(SuccessResponse.of("Flight ticket details retrieved successfully", ticket));
    }

    private Integer getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Claims claims = (Claims) auth.getCredentials();         
        return claims.get("user_id", Integer.class);
    }
}

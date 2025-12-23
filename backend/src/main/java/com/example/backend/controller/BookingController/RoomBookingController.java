package com.example.backend.controller.BookingController;

import io.jsonwebtoken.Claims;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import com.example.backend.dto.response.SuccessResponse;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.backend.dto.BookingDTOs.CreateBookingDTO;
import com.example.backend.service.BookingService.RoomBookingService;
import org.springframework.security.core.context.SecurityContextHolder;

@RestController
@RequestMapping("api/hotel/booking")
public class RoomBookingController {

    @Autowired
    private RoomBookingService roomBookingService;

    @PostMapping
    public ResponseEntity<SuccessResponse<Integer>> bookRoom(@RequestBody CreateBookingDTO createBookingDTO) {
        Integer bookingTransactionId = roomBookingService.bookingService(createBookingDTO, getUserId());
        return ResponseEntity.ok(SuccessResponse.of("Room booked successfully", bookingTransactionId));
    }

    private Integer getUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Claims claims = (Claims) auth.getCredentials();
        return claims.get("user_id", Integer.class);
    }

}

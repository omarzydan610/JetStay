package com.example.backend.controller.HotelController;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.example.backend.dto.HotelDTO.HotelDataResponse;
import com.example.backend.dto.HotelDTO.HotelStatisticsResponse;
import com.example.backend.dto.HotelDTO.HotelUpdateDataRequest;
import com.example.backend.dto.response.SuccessResponse;
import com.example.backend.service.HotelService.HotelDataService;
import com.example.backend.service.HotelService.HotelStatisticsService;

import io.jsonwebtoken.Claims;

@RestController
@RequestMapping("/api/hotel")
public class HotelDataController {

  @Autowired
  private HotelDataService hotelDataService;
  @Autowired
  private HotelStatisticsService hotelStatisticsService;

  @GetMapping("/data")
  public ResponseEntity<?> getData(@RequestHeader("Authorization") String token) {
    System.out.println("Authorization Header: " + token);
    HotelDataResponse data = hotelDataService.getData(token);
    return ResponseEntity.ok(SuccessResponse.of("Data retrieved successfully", data));
  }

  @PostMapping("/update")
  public ResponseEntity<?> updateData(@RequestHeader("Authorization") String token,
      @RequestBody HotelUpdateDataRequest request) {
    hotelDataService.updateData(token, request);
    return ResponseEntity.ok(SuccessResponse.of("Data updated successfully"));
  }

  @GetMapping("/statistics")
  public ResponseEntity<SuccessResponse<HotelStatisticsResponse>> getAllStatistics() {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    Claims claims = (Claims) auth.getCredentials();
    HotelStatisticsResponse stats = hotelStatisticsService.getAllStatistics(claims.get("hotel_id", Integer.class));
    return ResponseEntity.ok(SuccessResponse.of("Hotel statistics retrieved successfully", stats));
  }
}

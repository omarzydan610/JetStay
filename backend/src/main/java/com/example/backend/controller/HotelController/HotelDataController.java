package com.example.backend.controller.HotelController;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.backend.dto.HotelDTO.HotelDataResponse;
import com.example.backend.dto.HotelDTO.HotelUpdateDataRequest;
import com.example.backend.dto.response.SuccessResponse;
import com.example.backend.service.HotelService.HotelDataService;

@RestController
@RequestMapping("/api/hotel")
public class HotelDataController {

  @Autowired
  private HotelDataService hotelDataService;

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
}

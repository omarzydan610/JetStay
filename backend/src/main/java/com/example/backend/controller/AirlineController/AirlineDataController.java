package com.example.backend.controller.AirlineController;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.backend.dto.response.SuccessResponse;
import com.example.backend.dto.AirlineDTO.AirlineDataResponse;
import com.example.backend.dto.AirlineDTO.AirlineUpdateDataRequest;
import com.example.backend.service.AirlineService.AirlineDataService;

@RestController
@RequestMapping("/api/airline")
public class AirlineDataController {

  @Autowired
  private AirlineDataService airlineDataService;

  @GetMapping("/data")
  public ResponseEntity<?> getData(@RequestHeader("Authorization") String token) {
    AirlineDataResponse data = airlineDataService.getData(token);
    return ResponseEntity.ok(SuccessResponse.of("Data retrieved successfully", data));
  }

  @PostMapping("/update")
  public ResponseEntity<?> updateData(@RequestHeader("Authorization") String token,
      @ModelAttribute AirlineUpdateDataRequest request) {
    airlineDataService.updateData(token, request);
    return ResponseEntity.ok(SuccessResponse.of("Data updated successfully"));
  }
}

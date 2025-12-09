package com.example.backend.controller.UserController;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;
import com.example.backend.dto.UserDto.UserUpdateRequest;

import com.example.backend.dto.UserDto.UserDataResponse;
import com.example.backend.dto.response.SuccessResponse;
import com.example.backend.service.UserData.UserDataService;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "*")
public class UserController {

  @Autowired
  private UserDataService userDataService;

  @GetMapping("/data")
  public ResponseEntity<?> getData(@RequestHeader("Authorization") String token) {
    UserDataResponse data = userDataService.getData(token);
    return ResponseEntity.ok(SuccessResponse.of("Data retrieved successfully", data));
  }

  @PatchMapping("/update-info")
  public ResponseEntity<?> updateData(@RequestHeader("Authorization") String token, @RequestBody UserUpdateRequest request) {
    UserDataResponse updatedData = userDataService.updateData(token, request);
    return ResponseEntity.ok(SuccessResponse.of("Data updated successfully", updatedData));
  }
}
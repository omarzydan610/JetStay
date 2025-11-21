package com.example.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.backend.dto.ApiResponse;
import com.example.backend.dto.AuthDTO.ForgotPasswordRequest;
import com.example.backend.service.AuthService.ForgetResetPasswordService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class ForgotPasswordController {

  @Autowired
  private ForgetResetPasswordService forgotPasswordService;

  @PostMapping("/forgot-password")
  public ResponseEntity<ApiResponse> sendOtp(@RequestBody ForgotPasswordRequest request) {
    System.out.println("Received forgot password request: " + request);

    try {
      String email = request.getEmail();

      if (email == null || email.trim().isEmpty()) {
        return ResponseEntity.badRequest().body(ApiResponse.error("Email is required"));
      }

      // Send OTP email
      forgotPasswordService.forgotPassword(email);

      return ResponseEntity.ok(ApiResponse.success("OTP has been sent to your email"));

    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body(ApiResponse.error("Failed to send OTP: " + e.getMessage()));
    }
  }

}

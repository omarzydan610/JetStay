package com.example.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.backend.dto.ApiResponse;
import com.example.backend.dto.AuthDTO.ChangePasswordRequest;
import com.example.backend.dto.AuthDTO.ForgotPasswordRequest;
import com.example.backend.dto.AuthDTO.VerifyOtpRequest;
import com.example.backend.dto.AuthDTO.VerifyOtpResponse;
import com.example.backend.service.AuthService.ForgetResetPasswordService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class ForgotPasswordController {

  @Autowired
  private ForgetResetPasswordService forgotPasswordService;

  @PostMapping("/forgot-password")
  public ResponseEntity<ApiResponse> sendOtp(@RequestBody ForgotPasswordRequest request) {
    try {
      forgotPasswordService.forgotPassword(request.getEmail());
      return ResponseEntity.ok(ApiResponse.success("OTP has been sent to your email"));
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST)
          .body(ApiResponse.error(e.getMessage()));
    }
  }

  @PostMapping("/verify-otp")
  public ResponseEntity<?> verifyOtp(@RequestBody VerifyOtpRequest request) {
    try {
      String resetToken = forgotPasswordService.verifyOtp(request.getEmail(), request.getOtp());
      VerifyOtpResponse response = new VerifyOtpResponse(resetToken, "OTP verified successfully");
      return ResponseEntity.ok(response);
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST)
          .body(ApiResponse.error(e.getMessage()));
    }
  }

  @PostMapping("/change-password")
  public ResponseEntity<ApiResponse> changePasswordWithToken(
      @RequestBody ChangePasswordRequest request,
      @RequestHeader("Reset-Token") String resetToken) {
    try {
      forgotPasswordService.changePassword(request.getEmail(), resetToken, request.getNewPassword());
      return ResponseEntity.ok(ApiResponse.success("Password changed successfully"));
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST)
          .body(ApiResponse.error(e.getMessage()));
    }
  }

}

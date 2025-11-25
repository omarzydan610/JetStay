package com.example.backend.controller.AuthController;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.backend.dto.response.SuccessResponse;
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
  public ResponseEntity<SuccessResponse<Void>> sendOtp(@RequestBody ForgotPasswordRequest request) {
    forgotPasswordService.forgotPassword(request.getEmail());
    return ResponseEntity.ok(SuccessResponse.of("OTP has been sent to your email"));
  }

  @PostMapping("/verify-otp")
  public ResponseEntity<SuccessResponse<VerifyOtpResponse>> verifyOtp(@RequestBody VerifyOtpRequest request) {
    String resetToken = forgotPasswordService.verifyOtp(request.getEmail(), request.getOtp());
    VerifyOtpResponse data = new VerifyOtpResponse(resetToken, "OTP verified successfully");
    return ResponseEntity.ok(SuccessResponse.of("OTP verified successfully", data));
  }

  @PostMapping("/change-password")
  public ResponseEntity<SuccessResponse<Void>> changePasswordWithToken(
      @RequestBody ChangePasswordRequest request,
      @RequestHeader("Reset-Token") String resetToken) {
    forgotPasswordService.changePassword(request.getEmail(), resetToken, request.getNewPassword());
    return ResponseEntity.ok(SuccessResponse.of("Password changed successfully"));
  }

}

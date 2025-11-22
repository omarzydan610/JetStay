package com.example.backend.dto.AuthDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChangePasswordWithOtpRequest {
  private String email;
  private String newPassword;
  private String otp;
}

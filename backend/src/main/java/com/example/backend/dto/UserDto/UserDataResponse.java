package com.example.backend.dto.UserDto;

import com.example.backend.entity.User;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class UserDataResponse {
  private String firstName;
  private String lastName;
  private String email;
  private String phoneNumber;
  private User.UserRole role;
  private User.UserStatus status;
}

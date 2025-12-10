package com.example.backend.dto.UserDto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class UserUpdateRequest {
    private String firstName;
    private String lastName;
    private String phoneNumber;
}

package com.example.backend.controller;

import com.example.backend.dto.SignupResponseDTO;
import com.example.backend.dto.UserDTO;
import com.example.backend.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")

public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signup")
    public ResponseEntity<SignupResponseDTO> createUser(@RequestBody UserDTO user) {
        return ResponseEntity.ok(authService.SignUp(user));
    }

}

package com.example.backend.controller.AuthControllers;

import com.example.backend.dto.AuthDTO.UserDTO;
import com.example.backend.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")

public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }


    @PostMapping("/signup")
    public ResponseEntity<?> createUser(@RequestBody UserDTO user) {
        Object response = authService.SignUp(user, null, null);
        return ResponseEntity.ok(response);
    }

}

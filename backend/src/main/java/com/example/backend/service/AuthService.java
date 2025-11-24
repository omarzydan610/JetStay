package com.example.backend.service;

import com.example.backend.dto.AuthDTO.UserDTO;
import com.example.backend.dto.response.ErrorResponse;
import com.example.backend.dto.response.SuccessResponse;
import com.example.backend.entity.User;
import com.example.backend.mapper.UserMapper;
import com.example.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class AuthService {

    private final PasswordEncoder encoder;
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public AuthService(PasswordEncoder encoder, UserRepository userRepository, UserMapper userMapper) {
        this.encoder = encoder;
        this.userRepository = userRepository;
        this.userMapper = userMapper;
    }

    public Object SignUp(UserDTO newuser, User.UserStatus userStatus, User.UserRole userRole){

        Optional<User> existingUser = userRepository.findByEmail(newuser.getEmail());

        if (existingUser.isPresent()) {
            return ErrorResponse.of(
                    "Email Already Exists",
                    "Email is already registered",
                    "/api/auth/signup"
            );
        }

        try {
            newuser.setPassword(encoder.encode(newuser.getPassword()));
            User user = userMapper.signupToUser(newuser);
            userRepository.save(user);
            return SuccessResponse.of(
                    "Signed up successfully"
            );

        } catch (Exception e) {
            return ErrorResponse.of(
                    "Signup Failed",
                    "An unexpected error occurred",
                    "/api/auth/signup"
            );
        }

    }
}
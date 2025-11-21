package com.example.backend.service;

import com.example.backend.dto.SignupResponseDTO;
import com.example.backend.dto.UserDTO;
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

    public SignupResponseDTO SignUp(UserDTO newuser){

        SignupResponseDTO response = new SignupResponseDTO();
        Optional<User> existingUser = userRepository.findByEmail(newuser.getEmail());

        if(existingUser.isPresent()){
            response.setStatus(false);
            response.setMessage("Email already registered");
            return response;
        }

        try {

            newuser.setPassword(encoder.encode(newuser.getPassword()));
            User user = userMapper.signupToUser(newuser);
            userRepository.save(user);
            response.setStatus(true);
            response.setMessage("Signed up successfully");

            return response;
        } catch (Exception e) {

            response.setStatus(false);
            response.setMessage("Sign up Failed");
            return response;
        }

    }
}
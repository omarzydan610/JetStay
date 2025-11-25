package com.example.backend.service.AuthService;

import com.example.backend.dto.AuthDTO.UserDTO;
import com.example.backend.exception.BadRequestException;
import com.example.backend.exception.InternalServerErrorException;
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
    private UserMapper userMapper;

    public AuthService(PasswordEncoder encoder, UserRepository userRepository) {
        this.encoder = encoder;
        this.userRepository = userRepository;
        this.userMapper = new UserMapper();
    }

    public void SignUp(UserDTO newuser) {
        SignUp(newuser, User.UserRole.CLIENT);
    }

    public void SignUp(UserDTO newuser, User.UserRole userRole) {
        Optional<User> existingUser = userRepository.findByEmail(newuser.getEmail());

        if (existingUser.isPresent()) {
            throw new BadRequestException("Email is already exists");
        }

        try {
            newuser.setPassword(encoder.encode(newuser.getPassword()));
            User user = userMapper.signupToUser(newuser, userRole);
            userRepository.save(user);

        } catch (Exception e) {
            throw new InternalServerErrorException("An unexpected error occurred", e);
        }
    }
}
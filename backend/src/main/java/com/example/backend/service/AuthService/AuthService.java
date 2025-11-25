package com.example.backend.service.AuthService;

import com.example.backend.dto.AuthDTO.LoginDTO;
import com.example.backend.dto.AuthDTO.UserDTO;
import com.example.backend.dto.response.ErrorResponse;
import com.example.backend.dto.response.SuccessResponse;
import com.example.backend.entity.User;
import com.example.backend.exception.UnauthorizedException;
import com.example.backend.mapper.UserMapper;
import com.example.backend.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class AuthService {

    private final PasswordEncoder encoder;
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final AuthenticationManager authenticationManager;
    private final JwtAuthService jwtAuthService;

    public AuthService(PasswordEncoder encoder, UserRepository userRepository, AuthenticationManager authenticationManager, JwtAuthService jwtAuthService) {
        this.encoder = encoder;
        this.userRepository = userRepository;
        this.userMapper = new UserMapper();
        this.authenticationManager = authenticationManager;
        this.jwtAuthService = jwtAuthService;
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
            User user = userMapper.signupToUser(newuser, userStatus, userRole);
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

    public Object Login(LoginDTO loginDTO) {


        User user = userRepository.findByEmail(loginDTO.getEmail())
                .orElseThrow(() -> new UnauthorizedException("User does not exist"));


        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginDTO.getEmail(),
                            loginDTO.getPassword()
                    )
            );
        } catch (AuthenticationException e) {
            throw new UnauthorizedException("Invalid email or password");
        }


        String token = jwtAuthService.generateAuthToken(loginDTO.getEmail());

        return SuccessResponse.of("Logged in successfully",token);
    }
}
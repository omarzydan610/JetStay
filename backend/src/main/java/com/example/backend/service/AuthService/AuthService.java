package com.example.backend.service.AuthService;

import com.example.backend.dto.AuthDTO.LoginDTO;
import com.example.backend.dto.AuthDTO.UserDTO;
import com.example.backend.dto.response.SuccessResponse;
import com.example.backend.exception.BadRequestException;
import com.example.backend.exception.InternalServerErrorException;
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
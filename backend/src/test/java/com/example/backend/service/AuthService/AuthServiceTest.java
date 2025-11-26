package com.example.backend.service.AuthService;

import com.example.backend.dto.AuthDTO.LoginDTO;
import com.example.backend.dto.AuthDTO.UserDTO;
import com.example.backend.exception.BadRequestException;
import com.example.backend.exception.InternalServerErrorException;
import com.example.backend.entity.User;
import com.example.backend.exception.UnauthorizedException;
import com.example.backend.mapper.UserMapper;
import com.example.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AuthServiceTest {

    @Mock
    private PasswordEncoder encoder;

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserMapper userMapper;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtAuthService jwtAuthService;

    @InjectMocks
    private AuthService authService;

    private UserDTO userDTO;
    private User user;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);

        userDTO = new UserDTO();
        userDTO.setEmail("test@example.com");
        userDTO.setPassword("1234");

        user = new User();
        user.setEmail("test@example.com");
        user.setPassword("encoded");
    }

    @Test
    void testSignupSuccess() {
        when(userRepository.findByEmail(userDTO.getEmail())).thenReturn(Optional.empty());
        when(encoder.encode(anyString())).thenReturn("encoded");

        authService.SignUp(userDTO);

        // Verify that user was saved (UserMapper is created internally, not mocked)
        verify(userRepository).save(any(User.class));
        verify(userRepository).findByEmail(userDTO.getEmail());
        verify(encoder).encode(anyString());
    }

    @Test
    void testSignupEmailAlreadyExists() {
        when(userRepository.findByEmail(userDTO.getEmail())).thenReturn(Optional.of(user));

        assertThrows(BadRequestException.class, () -> authService.SignUp(userDTO));
    }

    @Test
    void testSignupExceptionThrown() {
        when(userRepository.findByEmail(userDTO.getEmail())).thenReturn(Optional.empty());
        when(encoder.encode(anyString())).thenThrow(new RuntimeException("DB error"));

        assertThrows(InternalServerErrorException.class, () -> authService.SignUp(userDTO));
    }


    @Test
    void testLoginSuccess() {
        // Arrange
        LoginDTO loginDTO = new LoginDTO();
        loginDTO.setEmail("test@example.com");
        loginDTO.setPassword("123456");

        User user = new User();
        user.setEmail("test@example.com");
        user.setPassword("encodedPassword");
        user.setRole(User.UserRole.CLIENT);

        when(userRepository.findByEmail("test@example.com"))
                .thenReturn(Optional.of(user));

        when(authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken("test@example.com", "123456")
        )).thenReturn(mock(org.springframework.security.core.Authentication.class));

        // Because client user => managedIds = empty list
        when(jwtAuthService.generateAuthToken(user, null))
                .thenReturn("mocked-jwt-token");


        String token = authService.Login(loginDTO);
        assertEquals("mocked-jwt-token", token);
    }




    @Test
    void testLoginUserNotFound() {

        LoginDTO loginDTO = new LoginDTO();
        loginDTO.setEmail("notfound@example.com");
        loginDTO.setPassword("123");

        when(userRepository.findByEmail("notfound@example.com"))
                .thenReturn(Optional.empty());

        UnauthorizedException ex = assertThrows(
                UnauthorizedException.class,
                () -> authService.Login(loginDTO)
        );

        assertEquals("User does not exist", ex.getMessage());
    }


    @Test
    void testLoginWrongPassword() {

        LoginDTO loginDTO = new LoginDTO();
        loginDTO.setEmail("test@example.com");
        loginDTO.setPassword("wrong_pass");

        User user = new User();
        user.setEmail("test@example.com");
        user.setPassword("encodedPassword");

        when(userRepository.findByEmail("test@example.com"))
                .thenReturn(Optional.of(user));

        doThrow(new BadCredentialsException("Bad credentials"))
                .when(authenticationManager)
                .authenticate(any(UsernamePasswordAuthenticationToken.class));

        UnauthorizedException ex = assertThrows(
                UnauthorizedException.class,
                () -> authService.Login(loginDTO)
        );

        assertEquals("Invalid email or password", ex.getMessage());
    }
}

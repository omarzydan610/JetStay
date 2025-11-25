package com.example.backend.service.AuthService;

import com.example.backend.dto.AuthDTO.LoginDTO;
import com.example.backend.dto.AuthDTO.UserDTO;
import com.example.backend.dto.response.ErrorResponse;
import com.example.backend.dto.response.SuccessResponse;
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
        when(userMapper.signupToUser(any(),eq(null),eq(null))).thenReturn(user);

        Object response = authService.SignUp(userDTO, null, null);

        assertTrue(response instanceof SuccessResponse);
        SuccessResponse<?> success = (SuccessResponse<?>) response;

        assertEquals("Signed up successfully", success.getMessage());

        verify(userRepository).save(user);
    }

    @Test
    void testSignupEmailAlreadyExists() {
        when(userRepository.findByEmail(userDTO.getEmail())).thenReturn(Optional.of(user));

        Object response = authService.SignUp(userDTO, null, null);

        assertTrue(response instanceof ErrorResponse);
        ErrorResponse error = (ErrorResponse) response;

        assertEquals("Email Already Exists", error.getError());
        assertEquals("Email is already registered", error.getMessage());
        assertEquals("/api/auth/signup", error.getPath());
    }

    @Test
    void testSignupExceptionThrown() {
        when(userRepository.findByEmail(userDTO.getEmail())).thenReturn(Optional.empty());
        when(encoder.encode(anyString())).thenThrow(new RuntimeException("DB error"));

        Object response = authService.SignUp(userDTO, null, null);

        assertTrue(response instanceof ErrorResponse);
        ErrorResponse error = (ErrorResponse) response;

        assertEquals("Signup Failed", error.getError());
        assertEquals("An unexpected error occurred", error.getMessage());
        assertEquals("/api/auth/signup", error.getPath());
    }


    @Test
    void testLoginSuccess() {

        LoginDTO loginDTO = new LoginDTO();
        loginDTO.setEmail("test@example.com");
        loginDTO.setPassword("123456");

        User user = new User();
        user.setEmail("test@example.com");
        user.setPassword("encodedPassword");

        when(userRepository.findByEmail("test@example.com"))
                .thenReturn(Optional.of(user));

        when(authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken("test@example.com", "123456")
        )).thenReturn(mock(org.springframework.security.core.Authentication.class));

        when(jwtAuthService.generateAuthToken("test@example.com"))
                .thenReturn("mocked-jwt-token");

        Object response = authService.Login(loginDTO);

        assertTrue(response instanceof SuccessResponse);
        SuccessResponse success = (SuccessResponse) response;

        assertEquals("Logged in successfully", success.getMessage());
        assertEquals("mocked-jwt-token", success.getData());
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

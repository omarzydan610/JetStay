package com.example.backend.service.AuthService;

import com.example.backend.dto.AuthDTO.UserDTO;
import com.example.backend.exception.BadRequestException;
import com.example.backend.exception.InternalServerErrorException;
import com.example.backend.entity.User;
import com.example.backend.mapper.UserMapper;
import com.example.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
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
        when(userMapper.signupToUser(any(), any())).thenReturn(user);

        authService.SignUp(userDTO);

        verify(userRepository).save(user);
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
}

package com.example.backend.service;


import com.example.backend.dto.UserDto.UserDataResponse;
import com.example.backend.entity.User;
import com.example.backend.exception.BadRequestException;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.AuthService.JwtAuthService;
import com.example.backend.service.UserData.UserDataService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserDataServiceTest {

    @Mock
    private JwtAuthService jwtAuthService;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserDataService userDataService;

    private User testUser;
    private String token;
    private String header;

    @BeforeEach
    void setUp() {
        header = "Bearer test-token";
        token = "test-token";

        testUser = new User();
        testUser.setUserID(1);
        testUser.setEmail("user@test.com");
        testUser.setFirstName("John");
        testUser.setLastName("Doe");
    }

    @Test
    void getData_Success() {
        // Arrange
        when(jwtAuthService.extractTokenFromHeader(header)).thenReturn(token);
        when(jwtAuthService.extractEmail(token)).thenReturn("user@test.com");
        when(userRepository.findByEmail("user@test.com")).thenReturn(Optional.of(testUser));
        when(jwtAuthService.extractUserId(token)).thenReturn(1);

        // Act
        UserDataResponse response = userDataService.getData(header);

        // Assert
        assertNotNull(response);
        assertEquals("user@test.com", response.getEmail());
        assertEquals("John", response.getFirstName());

        verify(jwtAuthService).extractTokenFromHeader(header);
        verify(jwtAuthService).extractEmail(token);
        verify(userRepository).findByEmail("user@test.com");
        verify(jwtAuthService).extractUserId(token);
    }

    @Test
    void getData_InvalidHeader_ThrowsException() {
        when(jwtAuthService.extractTokenFromHeader(header))
                .thenThrow(new BadRequestException("Invalid Authorization header"));

        assertThrows(BadRequestException.class, () -> userDataService.getData(header));

        verify(jwtAuthService).extractTokenFromHeader(header);
        verifyNoInteractions(userRepository);
    }

    @Test
    void getData_UserNotFound_ThrowsException() {
        when(jwtAuthService.extractTokenFromHeader(header)).thenReturn(token);
        when(jwtAuthService.extractEmail(token)).thenReturn("user@test.com");
        when(userRepository.findByEmail("user@test.com")).thenReturn(Optional.empty());

        BadRequestException exception = assertThrows(
                BadRequestException.class,
                () -> userDataService.getData(header)
        );

        assertEquals("User not found", exception.getMessage());

        verify(jwtAuthService).extractTokenFromHeader(header);
        verify(jwtAuthService).extractEmail(token);
        verify(userRepository).findByEmail("user@test.com");
    }

    @Test
    void getData_TokenMismatch_ThrowsException() {
        when(jwtAuthService.extractTokenFromHeader(header)).thenReturn(token);
        when(jwtAuthService.extractEmail(token)).thenReturn("user@test.com");
        when(userRepository.findByEmail("user@test.com")).thenReturn(Optional.of(testUser));
        when(jwtAuthService.extractUserId(token)).thenReturn(999); // Wrong ID

        BadRequestException exception = assertThrows(
                BadRequestException.class,
                () -> userDataService.getData(header)
        );

        assertEquals("Token does not match user", exception.getMessage());

        verify(jwtAuthService).extractTokenFromHeader(header);
        verify(jwtAuthService).extractEmail(token);
        verify(userRepository).findByEmail("user@test.com");
        verify(jwtAuthService).extractUserId(token);
    }

    @Test
    void getData_NullHeader_ThrowsExceptionImmediately() {
        String invalidHeader = null;

        when(jwtAuthService.extractTokenFromHeader(invalidHeader))
                .thenThrow(new BadRequestException("Invalid Authorization header"));

        assertThrows(BadRequestException.class, () -> userDataService.getData(invalidHeader));

        verify(jwtAuthService).extractTokenFromHeader(invalidHeader);
        verifyNoInteractions(userRepository);
    }
}

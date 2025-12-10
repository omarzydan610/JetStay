package com.example.backend.service.UserData;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.example.backend.dto.UserDto.UserDataResponse;
import com.example.backend.dto.UserDto.UserUpdateRequest;
import com.example.backend.entity.User;
import com.example.backend.exception.BadRequestException;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.AuthService.JwtAuthService;

@ExtendWith(MockitoExtension.class)
class UserDataServiceTest {

    @Mock
    private JwtAuthService jwtAuthService;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserDataService userDataService;

    private User user;
    private String token;
    private String authHeader;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setUserID(1);
        user.setFirstName("Joe");
        user.setLastName("Original");
        user.setEmail("joe@test.com");
        user.setPhoneNumber("0100000000");
        user.setRole(User.UserRole.CLIENT); 

        token = "dummy-token";
        authHeader = "Bearer " + token;
    }

    @Test
    void getData_ShouldReturnUserData_WhenTokenIsValid() {
        when(jwtAuthService.extractTokenFromHeader(authHeader)).thenReturn(token);
        when(jwtAuthService.extractEmail(token)).thenReturn(user.getEmail());
        when(jwtAuthService.extractUserId(token)).thenReturn(user.getUserID());
        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));
        UserDataResponse response = userDataService.getData(authHeader);


        assertNotNull(response);
        assertEquals("Joe", response.getFirstName());
        assertEquals("joe@test.com", response.getEmail());
    }

    @Test
    void updateData_ShouldUpdateAndReturnNewData_WhenRequestIsValid() {
        // Arrange
        UserUpdateRequest updateRequest = new UserUpdateRequest("JoeUpdated", "NewLast", "0123456789");

        when(jwtAuthService.extractTokenFromHeader(authHeader)).thenReturn(token);
        when(jwtAuthService.extractEmail(token)).thenReturn(user.getEmail());
        when(jwtAuthService.extractUserId(token)).thenReturn(user.getUserID());
        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));
        
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        UserDataResponse response = userDataService.updateData(authHeader, updateRequest);

        // Assert
        assertEquals("JoeUpdated", response.getFirstName());
        assertEquals("NewLast", response.getLastName());
        assertEquals("0123456789", response.getPhoneNumber());
        verify(userRepository, times(1)).save(user);
    }

    @Test
    void getData_ShouldThrowException_WhenUserNotFound() {
        // Arrange
        when(jwtAuthService.extractTokenFromHeader(authHeader)).thenReturn(token);
        when(jwtAuthService.extractEmail(token)).thenReturn("unknown@test.com");
        when(userRepository.findByEmail("unknown@test.com")).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(BadRequestException.class, () -> {
            userDataService.getData(authHeader);
        }, "User not found");
    }

    @Test
    void getData_ShouldThrowException_WhenTokenIdDoesNotMatchUserId() {
        // Arrange
        when(jwtAuthService.extractTokenFromHeader(authHeader)).thenReturn(token);
        when(jwtAuthService.extractEmail(token)).thenReturn(user.getEmail());
        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));
        
        when(jwtAuthService.extractUserId(token)).thenReturn(99); 

        BadRequestException exception = assertThrows(BadRequestException.class, () -> {
            userDataService.getData(authHeader);
        });
        
        assertEquals("Token does not match user", exception.getMessage());
    }
}
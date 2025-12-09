package com.example.backend.controller.AuthController;

import com.example.backend.controller.TestSecurityConfig;
import com.example.backend.dto.AuthDTO.LoginDTO;
import com.example.backend.service.AuthService.AuthService;
import com.example.backend.service.AuthService.JwtAuthService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.mockito.Mockito.*;

@Import(TestSecurityConfig.class)
@WebMvcTest(AuthController.class)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    public AuthService authService;

    @MockBean
    private JwtAuthService jwtAuthService;

    @Test
    void testSignupSuccess() throws Exception {
        doNothing().when(authService).SignUp(any());

        mockMvc.perform(post("/api/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                        """
                                    {"firstName": "test", "lastName":"test", "email": "test@example.com", "password": "1234", "phoneNumber":"12345"}
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("User created successfully"));
    }

    @Test
    void testSignupError() throws Exception {
        doThrow(new com.example.backend.exception.BadRequestException("Email Already Exists")).when(authService)
                .SignUp(any());

        mockMvc.perform(post("/api/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                        """
                                    {"firstName": "test", "lastName":"test", "email": "test@example.com", "password": "1234", "phoneNumber":"12345"}
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Email Already Exists"));
    }

    @Test
    void testLoginSuccess() throws Exception {
        when(authService.Login(any(LoginDTO.class))).thenReturn("mocked-jwt-token");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                        {"email": "test@example.com", "password": "123456"}
                        """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Loged it Logged in successfully"))
                .andExpect(jsonPath("$.data").value("mocked-jwt-token"));
    }

    @Test
    void testLoginError() throws Exception {
        doThrow(new RuntimeException("Invalid email or password")).when(authService).Login(any(LoginDTO.class));

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                        {"email": "wrong@example.com", "password": "wrong"}
                        """))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Invalid email or password"));
    }

}


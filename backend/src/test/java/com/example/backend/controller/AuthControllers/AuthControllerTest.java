package com.example.backend.controller.AuthControllers;

import com.example.backend.dto.response.ErrorResponse;
import com.example.backend.dto.response.SuccessResponse;
import com.example.backend.service.AuthService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
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

    @Test
    void testSignupSuccess() throws Exception {
        SuccessResponse<String> success = SuccessResponse.of("Signed up successfully", "User");

        when(authService.SignUp(any(), any(), any())).thenReturn(success);

        mockMvc.perform(post("/api/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                    {"firstName": "test", "lastName":"test", "email": "test@example.com", "password": "1234", "phoneNumber":"12345"}
                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Signed up successfully"));
    }

    @Test
    void testSignupError() throws Exception {
        ErrorResponse error = ErrorResponse.of(
                "Email Already Exists",
                "Email is already registered",
                "/api/auth/signup"
        );

        when(authService.SignUp(any(), any(), any())).thenReturn(error);

        mockMvc.perform(post("/api/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                    {"firstName": "test", "lastName":"test", "email": "test@example.com", "password": "1234", "phoneNumber":"12345"}
                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.error").value("Email Already Exists"))
                .andExpect(jsonPath("$.message").value("Email is already registered"));
    }
}

// Test security configuration
@EnableWebSecurity
class TestSecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf().disable()
                .authorizeHttpRequests(authz -> authz.anyRequest().permitAll());
        return http.build();
    }
}
package com.example.backend.controller.UserController;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.example.backend.dto.UserDto.UserDataResponse;
import com.example.backend.dto.UserDto.UserUpdateRequest;
import com.example.backend.service.AuthService.JwtAuthService;
import com.example.backend.service.UserData.UserDataService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.example.backend.entity.User;


@WebMvcTest(UserController.class)
@AutoConfigureMockMvc(addFilters = false)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserDataService userDataService;

    @MockBean
    private JwtAuthService jwtAuthService;

    @Autowired
    private ObjectMapper objectMapper;

    private String token;
    private UserDataResponse mockUserResponse;

@BeforeEach
    void setUp() {
        token = "Bearer dummy-token";
        
        mockUserResponse = new UserDataResponse();
        mockUserResponse.setFirstName("Joe");
        mockUserResponse.setLastName("Doe");
        mockUserResponse.setEmail("joe@test.com");
        mockUserResponse.setRole(User.UserRole.CLIENT);
        mockUserResponse.setPhoneNumber("010xxxxxx");
    }

    @Test
    void getData_ShouldReturnOk_WhenTokenIsValid() throws Exception {
        when(userDataService.getData(token)).thenReturn(mockUserResponse);

        // Act & Assert
        mockMvc.perform(get("/api/user/data")
                .header("Authorization", token)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true)) 
                .andExpect(jsonPath("$.message").value("Data retrieved successfully"))
                .andExpect(jsonPath("$.data.firstName").value("Joe"));
    }

    // --- Test: PATCH /api/user/update-info ---
    @Test
    void updateData_ShouldReturnOk_WhenRequestIsValid() throws Exception {
        // Arrange
        UserUpdateRequest request = new UserUpdateRequest("JoeUpdated", "DoeUpdated", "011xxxxxx");
        
        UserDataResponse updatedResponse = new UserDataResponse();
        updatedResponse.setFirstName("JoeUpdated");
        updatedResponse.setLastName("DoeUpdated");
        updatedResponse.setEmail("joe@test.com");
        updatedResponse.setRole(User.UserRole.CLIENT);
        updatedResponse.setPhoneNumber("011xxxxxx");


        when(userDataService.updateData(eq(token), any(UserUpdateRequest.class)))
                .thenReturn(updatedResponse);

        // Act & Assert
        mockMvc.perform(patch("/api/user/update-info")
                .header("Authorization", token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Data updated successfully"))
                .andExpect(jsonPath("$.data.firstName").value("JoeUpdated"))
                .andExpect(jsonPath("$.data.phoneNumber").value("011xxxxxx"));
    }
}
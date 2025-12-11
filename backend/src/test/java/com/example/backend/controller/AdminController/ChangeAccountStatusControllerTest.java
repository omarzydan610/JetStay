package com.example.backend.controller.AdminController;

import com.example.backend.controller.SystemAdminController.ChangeAccountStatusController;
import com.example.backend.controller.TestSecurityConfig;
import com.example.backend.service.AuthService.JwtAuthService;
import com.example.backend.service.SystemAdminService.ChangeAccountStatus;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@Import(TestSecurityConfig.class)
@WebMvcTest(ChangeAccountStatusController.class)
class ChangeAccountStatusControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ChangeAccountStatus changeAccountStatusService;

    @MockBean
    private JwtAuthService jwtAuthService;

    @Test
    void activateUser_ShouldReturnSuccess() throws Exception {
        doNothing().when(changeAccountStatusService).activateUser("test@mail.com");

        mockMvc.perform(put("/api/admin/status/user/activate")
                        .param("email", "test@mail.com")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("User activated successfully"));

        verify(changeAccountStatusService, times(1)).activateUser("test@mail.com");
    }

    @Test
    void deactivateUser_ShouldReturnSuccess() throws Exception {
        doNothing().when(changeAccountStatusService).deactivateUser("test@mail.com", "spam activity");

        mockMvc.perform(put("/api/admin/status/user/deactivate")
                        .param("email", "test@mail.com")
                        .param("reason", "spam activity")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("User Deactivated successfully"));

        verify(changeAccountStatusService, times(1))
                .deactivateUser("test@mail.com", "spam activity");
    }

    @Test
    void activateAirline_ShouldReturnSuccess() throws Exception {
        doNothing().when(changeAccountStatusService).activateAirline(5);

        mockMvc.perform(put("/api/admin/status/airline/activate")
                        .param("airlineID", "5"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Airline Activated successfully"));

        verify(changeAccountStatusService, times(1)).activateAirline(5);
    }

    @Test
    void deactivateAirline_ShouldReturnSuccess() throws Exception {
        doNothing().when(changeAccountStatusService).deactivateAirline(10, "license expired");

        mockMvc.perform(put("/api/admin/status/airline/deactivate")
                        .param("airlineID", "10")
                        .param("reason", "license expired"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Airline Deactivated successfully"));

        verify(changeAccountStatusService, times(1))
                .deactivateAirline(10, "license expired");
    }

    @Test
    void activateHotel_ShouldReturnSuccess() throws Exception {
        doNothing().when(changeAccountStatusService).activateHotel(3);

        mockMvc.perform(put("/api/admin/status/hotel/activate")
                        .param("hotelID", "3"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Hotel Activated successfully"));

        verify(changeAccountStatusService, times(1)).activateHotel(3);
    }

    @Test
    void deactivateHotel_ShouldReturnSuccess() throws Exception {
        doNothing().when(changeAccountStatusService).deactivateHotel(8, "unsafe rooms");

        mockMvc.perform(put("/api/admin/status/hotel/deactivate")
                        .param("hotelID", "8")
                        .param("reason", "unsafe rooms"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Hotel Deactivated successfully"));

        verify(changeAccountStatusService, times(1))
                .deactivateHotel(8, "unsafe rooms");
    }
}

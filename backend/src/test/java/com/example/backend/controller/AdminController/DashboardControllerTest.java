package com.example.backend.controller.AdminController;

import com.example.backend.controller.SystemAdminController.DashboardController;
import com.example.backend.controller.TestSecurityConfig;
import com.example.backend.dto.AdminDashboard.*;
import com.example.backend.dto.response.SuccessResponse;
import com.example.backend.entity.Airline;
import com.example.backend.entity.Hotel;
import com.example.backend.entity.User;
import com.example.backend.service.AuthService.JwtAuthService;
import com.example.backend.service.SystemAdminService.AdminDashboardService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@Import(TestSecurityConfig.class)
@WebMvcTest(DashboardController.class)
class DashboardControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AdminDashboardService adminDashboardService;

    @MockBean
    private JwtAuthService jwtAuthService;

    @Autowired
    private ObjectMapper objectMapper;

    private Page<UserDataDTO> userPage;
    private Page<HotelDataDTO> hotelPage;
    private Page<AirlineDataDTO> airlinePage;

    @BeforeEach
    void setUp() {

        // ===== Users =====
        UserDataDTO user = new UserDataDTO();
        user.setId(10);
        user.setFirstName("John");
        user.setLastName("Doe");
        user.setEmail("john@mail.com");
        user.setPhoneNumber("+1234567890");
        user.setRole(User.UserRole.CLIENT);
        user.setStatus(User.UserStatus.ACTIVE);
        userPage = new PageImpl<>(Collections.singletonList(user));

        // ===== Hotels =====
        HotelDataDTO hotel = new HotelDataDTO();
        hotel.setId(3);
        hotel.setName("Cairo Inn");
        hotel.setLogoURL("http://example.com/logo.png");
        hotel.setCountry("Egypt");
        hotel.setCity("Cairo");
        hotel.setRate(4.5f);
        hotel.setStatus(Hotel.Status.ACTIVE);
        hotelPage = new PageImpl<>(Collections.singletonList(hotel));

        // ===== Airlines =====
        AirlineDataDTO airline = new AirlineDataDTO();
        airline.setId(7);
        airline.setName("Egypt Air");
        airline.setLogoURL("http://example.com/airline-logo.png");
        airline.setNationality("Egyptian");
        airline.setRate(5.0f);
        airline.setStatus(Airline.Status.ACTIVE);
        airlinePage = new PageImpl<>(Collections.singletonList(airline));
    }


    @Test
    void getUsersByFilter_ShouldReturnSuccess() throws Exception {
        UserViewCriteriaDTO criteria = new UserViewCriteriaDTO();
        criteria.setStatus(User.UserStatus.ACTIVE);

        when(adminDashboardService.getUsersByCriteria(ArgumentMatchers.any()))
                .thenReturn(userPage);

        mockMvc.perform(post("/api/admin/dashboard/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(criteria)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Fetch Users Successfully"))
                .andExpect(jsonPath("$.data.content[0].firstName").value("John"))
                .andExpect(jsonPath("$.data.content[0].phoneNumber").value("+1234567890"));
    }


    @Test
    void getHotelsByFilter_ShouldReturnSuccess() throws Exception {
        HotelViewCriteriaDTO criteria = new HotelViewCriteriaDTO();
        criteria.setStatus(Hotel.Status.ACTIVE);

        when(adminDashboardService.getHotelsByCriteria(ArgumentMatchers.any()))
                .thenReturn(hotelPage);

        mockMvc.perform(post("/api/admin/dashboard/hotels")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(criteria)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Fetch Hotels Successfully"))
                .andExpect(jsonPath("$.data.content[0].name").value("Cairo Inn"))
                .andExpect(jsonPath("$.data.content[0].country").value("Egypt"))
                .andExpect(jsonPath("$.data.content[0].city").value("Cairo"));
    }


    @Test
    void getAirlinesByFilter_ShouldReturnSuccess() throws Exception {
        AirlineViewCriteriaDTO criteria = new AirlineViewCriteriaDTO();
        criteria.setStatus(Airline.Status.ACTIVE);

        when(adminDashboardService.getAirlinesByCriteria(ArgumentMatchers.any()))
                .thenReturn(airlinePage);

        mockMvc.perform(post("/api/admin/dashboard/airlines")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(criteria)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Fetch Airlines Successfully"))
                .andExpect(jsonPath("$.data.content[0].name").value("Egypt Air"))
                .andExpect(jsonPath("$.data.content[0].nationality").value("Egyptian"));
    }

    @Test
    void getUsersByFilter_EmptyResult_ShouldReturnEmptyPage() throws Exception {
        Page<UserDataDTO> emptyPage = new PageImpl<>(Collections.emptyList());

        when(adminDashboardService.getUsersByCriteria(ArgumentMatchers.any()))
                .thenReturn(emptyPage);

        UserViewCriteriaDTO criteria = new UserViewCriteriaDTO();
        criteria.setStatus(User.UserStatus.ACTIVE);

        mockMvc.perform(post("/api/admin/dashboard/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(criteria)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.content").isArray())
                .andExpect(jsonPath("$.data.content").isEmpty());
    }

    @Test
    void getHotelsByFilter_EmptyResult_ShouldReturnEmptyPage() throws Exception {
        Page<HotelDataDTO> emptyPage = new PageImpl<>(Collections.emptyList());

        when(adminDashboardService.getHotelsByCriteria(ArgumentMatchers.any()))
                .thenReturn(emptyPage);

        HotelViewCriteriaDTO criteria = new HotelViewCriteriaDTO();
        criteria.setStatus(Hotel.Status.ACTIVE);

        mockMvc.perform(post("/api/admin/dashboard/hotels")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(criteria)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.content").isArray())
                .andExpect(jsonPath("$.data.content").isEmpty());
    }

    @Test
    void getAirlinesByFilter_EmptyResult_ShouldReturnEmptyPage() throws Exception {
        Page<AirlineDataDTO> emptyPage = new PageImpl<>(Collections.emptyList());

        when(adminDashboardService.getAirlinesByCriteria(ArgumentMatchers.any()))
                .thenReturn(emptyPage);

        AirlineViewCriteriaDTO criteria = new AirlineViewCriteriaDTO();
        criteria.setStatus(Airline.Status.ACTIVE);

        mockMvc.perform(post("/api/admin/dashboard/airlines")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(criteria)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.content").isArray())
                .andExpect(jsonPath("$.data.content").isEmpty());
    }

    // Additional test for pagination
    @Test
    void getUsersByFilter_WithPagination_ShouldReturnCorrectPage() throws Exception {
        UserViewCriteriaDTO criteria = new UserViewCriteriaDTO();
        criteria.setPage(0);
        criteria.setSize(10);
        criteria.setStatus(User.UserStatus.ACTIVE);

        when(adminDashboardService.getUsersByCriteria(ArgumentMatchers.any()))
                .thenReturn(userPage);

        mockMvc.perform(post("/api/admin/dashboard/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(criteria)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.content").isArray())
                .andExpect(jsonPath("$.data.content[0].id").value(10))
                .andExpect(jsonPath("$.data.totalElements").exists());
    }

    // Test with search criteria
    @Test
    void getUsersByFilter_WithSearch_ShouldReturnFilteredResults() throws Exception {
        UserViewCriteriaDTO criteria = new UserViewCriteriaDTO();
        criteria.setSearch("John");
        criteria.setStatus(User.UserStatus.ACTIVE);

        when(adminDashboardService.getUsersByCriteria(ArgumentMatchers.any()))
                .thenReturn(userPage);

        mockMvc.perform(post("/api/admin/dashboard/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(criteria)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.content[0].firstName").value("John"));
    }

    // Test with multiple filters
    @Test
    void getUsersByFilter_WithMultipleFilters_ShouldReturnFilteredResults() throws Exception {
        UserViewCriteriaDTO criteria = new UserViewCriteriaDTO();
        criteria.setSearch("john@mail.com");
        criteria.setStatus(User.UserStatus.ACTIVE);
        criteria.setRole(User.UserRole.CLIENT);

        when(adminDashboardService.getUsersByCriteria(ArgumentMatchers.any()))
                .thenReturn(userPage);

        mockMvc.perform(post("/api/admin/dashboard/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(criteria)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.content[0].email").value("john@mail.com"))
                .andExpect(jsonPath("$.data.content[0].role").value("CLIENT"));
    }

}
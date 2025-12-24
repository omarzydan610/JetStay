package com.example.backend.controller.UserController;

import com.example.backend.dto.BookingDTO.BookingResponse;
import com.example.backend.dto.response.SuccessResponse;
import com.example.backend.service.BookingHistoryService.BookingHistoryService;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@DisplayName("BookingHistoryController Integration Tests")
class BookingHistoryControllerTest {

  @Autowired
  private MockMvc mockMvc;

  @MockBean
  private BookingHistoryService bookingService;

  @Autowired
  private ObjectMapper objectMapper;

  private BookingResponse testHotelBooking;
  private BookingResponse testFlightBooking;

  @BeforeEach
  void setUp() {
    // Initialize test booking responses
    testHotelBooking = new BookingResponse();
    testHotelBooking.setType("HOTEL");

    testFlightBooking = new BookingResponse();
    testFlightBooking.setType("FLIGHT");
  }

  @Test
  @DisplayName("GET /api/bookings/history - Should return booking history successfully")
  @WithMockUser(username = "testuser", roles = { "USER" })
  void testGetBookingHistorySuccess() throws Exception {
    // Arrange
    List<BookingResponse> mockHistory = new ArrayList<>();
    mockHistory.add(testHotelBooking);
    mockHistory.add(testFlightBooking);

    when(bookingService.getBookingHistory(anyInt()))
        .thenReturn(mockHistory);

    // Act & Assert
    MvcResult result = mockMvc.perform(get("/api/bookings/history")
        .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.success").value(true))
        .andExpect(jsonPath("$.message").value("Booking history retrieved successfully"))
        .andExpect(jsonPath("$.data").isArray())
        .andReturn();

    String content = result.getResponse().getContentAsString();
    assertNotNull(content);
    assertTrue(content.contains("HOTEL"));
    assertTrue(content.contains("FLIGHT"));
  }

  @Test
  @DisplayName("GET /api/bookings/history - Should return empty list when no bookings")
  @WithMockUser(username = "testuser", roles = { "USER" })
  void testGetBookingHistoryEmpty() throws Exception {
    // Arrange
    when(bookingService.getBookingHistory(anyInt()))
        .thenReturn(new ArrayList<>());

    // Act & Assert
    mockMvc.perform(get("/api/bookings/history")
        .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data").isArray())
        .andExpect(jsonPath("$.data.length()").value(0));
  }

  @Test
  @DisplayName("GET /api/bookings/upcoming - Should return upcoming bookings successfully")
  @WithMockUser(username = "testuser", roles = { "USER" })
  void testGetUpcomingBookingsSuccess() throws Exception {
    // Arrange
    List<BookingResponse> mockUpcoming = new ArrayList<>();
    mockUpcoming.add(testHotelBooking);

    when(bookingService.getUpcomingBookings(anyInt()))
        .thenReturn(mockUpcoming);

    // Act & Assert
    MvcResult result = mockMvc.perform(get("/api/bookings/upcoming")
        .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.success").value(true))
        .andExpect(jsonPath("$.message").value("Upcoming bookings retrieved successfully"))
        .andExpect(jsonPath("$.data").isArray())
        .andExpect(jsonPath("$.data.length()").value(1))
        .andReturn();

    String content = result.getResponse().getContentAsString();
    assertNotNull(content);
    assertTrue(content.contains("HOTEL"));
  }

  @Test
  @DisplayName("GET /api/bookings/upcoming - Should return empty list when no upcoming bookings")
  @WithMockUser(username = "testuser", roles = { "USER" })
  void testGetUpcomingBookingsEmpty() throws Exception {
    // Arrange
    when(bookingService.getUpcomingBookings(anyInt()))
        .thenReturn(new ArrayList<>());

    // Act & Assert
    mockMvc.perform(get("/api/bookings/upcoming")
        .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.length()").value(0));
  }

  @Test
  @DisplayName("GET /api/bookings/{bookingId} - Should return booking details successfully")
  @WithMockUser(username = "testuser", roles = { "USER" })
  void testGetBookingDetailsSuccess() throws Exception {
    // Arrange
    when(bookingService.getBookingDetails(1))
        .thenReturn(testHotelBooking);

    // Act & Assert
    MvcResult result = mockMvc.perform(get("/api/bookings/1")
        .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.success").value(true))
        .andExpect(jsonPath("$.message").value("Booking details retrieved successfully"))
        .andExpect(jsonPath("$.data.type").value("HOTEL"))
        .andReturn();

    String content = result.getResponse().getContentAsString();
    assertNotNull(content);
  }

  @Test
  @DisplayName("GET /api/bookings/{bookingId} - Should return flight booking details")
  @WithMockUser(username = "testuser", roles = { "USER" })
  void testGetFlightBookingDetails() throws Exception {
    // Arrange
    when(bookingService.getBookingDetails(2))
        .thenReturn(testFlightBooking);

    // Act & Assert
    mockMvc.perform(get("/api/bookings/2")
        .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.type").value("FLIGHT"));
  }

  @Test
  @DisplayName("GET /api/bookings/{bookingId} - Should handle not found error")
  @WithMockUser(username = "testuser", roles = { "USER" })
  void testGetBookingDetailsNotFound() throws Exception {
    // Arrange
    when(bookingService.getBookingDetails(999))
        .thenThrow(new com.example.backend.exception.ResourceNotFoundException("Booking not found"));

    // Act & Assert
    mockMvc.perform(get("/api/bookings/999")
        .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isNotFound());
  }

  @Test
  @DisplayName("GET /api/bookings/history - Should accept CORS requests")
  @WithMockUser(username = "testuser", roles = { "USER" })
  void testBookingHistoryCors() throws Exception {
    // Arrange
    when(bookingService.getBookingHistory(anyInt()))
        .thenReturn(new ArrayList<>());

    // Act & Assert
    mockMvc.perform(get("/api/bookings/history")
        .header("Origin", "http://localhost:3000")
        .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk());
  }

  @Test
  @DisplayName("GET /api/bookings/upcoming - Should validate user authentication")
  void testGetUpcomingBookingsRequiresAuth() throws Exception {
    // Act & Assert - Should fail without authentication
    mockMvc.perform(get("/api/bookings/upcoming")
        .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isUnauthorized());
  }

  @Test
  @DisplayName("GET /api/bookings/history - Should validate user authentication")
  void testGetBookingHistoryRequiresAuth() throws Exception {
    // Act & Assert - Should fail without authentication
    mockMvc.perform(get("/api/bookings/history")
        .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isUnauthorized());
  }

  @Test
  @DisplayName("GET /api/bookings/{bookingId} - Should validate user authentication")
  void testGetBookingDetailsRequiresAuth() throws Exception {
    // Act & Assert - Should fail without authentication
    mockMvc.perform(get("/api/bookings/1")
        .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isUnauthorized());
  }

  @Test
  @DisplayName("GET /api/bookings/history - Should return proper response structure")
  @WithMockUser(username = "testuser", roles = { "USER" })
  void testGetBookingHistoryResponseStructure() throws Exception {
    // Arrange
    List<BookingResponse> mockHistory = new ArrayList<>();
    mockHistory.add(testHotelBooking);

    when(bookingService.getBookingHistory(anyInt()))
        .thenReturn(mockHistory);

    // Act & Assert
    mockMvc.perform(get("/api/bookings/history"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.success").isBoolean())
        .andExpect(jsonPath("$.message").isString())
        .andExpect(jsonPath("$.data").isArray());
  }

  @Test
  @DisplayName("GET /api/bookings/upcoming - Should return proper response structure")
  @WithMockUser(username = "testuser", roles = { "USER" })
  void testGetUpcomingBookingsResponseStructure() throws Exception {
    // Arrange
    List<BookingResponse> mockUpcoming = new ArrayList<>();
    mockUpcoming.add(testFlightBooking);

    when(bookingService.getUpcomingBookings(anyInt()))
        .thenReturn(mockUpcoming);

    // Act & Assert
    mockMvc.perform(get("/api/bookings/upcoming"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.success").isBoolean())
        .andExpect(jsonPath("$.message").isString())
        .andExpect(jsonPath("$.data").isArray());
  }

  @Test
  @DisplayName("GET /api/bookings/{bookingId} - Should return proper response structure")
  @WithMockUser(username = "testuser", roles = { "USER" })
  void testGetBookingDetailsResponseStructure() throws Exception {
    // Arrange
    when(bookingService.getBookingDetails(1))
        .thenReturn(testHotelBooking);

    // Act & Assert
    mockMvc.perform(get("/api/bookings/1"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.success").isBoolean())
        .andExpect(jsonPath("$.message").isString())
        .andExpect(jsonPath("$.data").isMap())
        .andExpect(jsonPath("$.data.type").value("HOTEL"));
  }
}

package com.example.backend.controller.AdminController;

import com.example.backend.controller.TestSecurityConfig;
import com.example.backend.dto.AdminDTO.BookingMonitoringResponse;
import com.example.backend.dto.AdminDTO.FlightMonitoringResponse;
import com.example.backend.dto.AdminDTO.PartnerShipNameResponse;
import com.example.backend.service.AdminService.AdminService;
import com.example.backend.service.AuthService.JwtAuthService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.*;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.mockito.Mockito.*;

@Import(TestSecurityConfig.class)
@WebMvcTest(AdminController.class)
class AdminControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AdminService adminService;

    @MockBean
    private JwtAuthService jwtAuthService;

    // ==================== monitorBookings Tests ====================

    @Test
    @DisplayName("Monitor bookings - all hotels - success")
    void testMonitorBookings_AllHotels_Success() throws Exception {
        // Arrange
        LocalDate startDate = LocalDate.of(2024, 1, 1);
        LocalDate endDate = LocalDate.of(2024, 1, 31);
        long hotelId = 0L;

        BookingMonitoringResponse response = BookingMonitoringResponse.builder()
                .totalBookings(100)
                .totalRevenue(50000.0)
                .totalGuests(200.0)
                .totalRoomsBooked(150.0)
                .bookingsByStatus(Map.of("CONFIRMED", 70, "PENDING", 30))
                .bookingsByPaymentStatus(Map.of("paid", 80, "unpaid", 20))
                .bookingsByHotel(new ArrayList<>())
                .bookingsByPaymentMethod(new ArrayList<>())
                .dailyBookings(new ArrayList<>())
                .build();

        when(adminService.monitorBookings(startDate, endDate, hotelId)).thenReturn(response);

        // Act & Assert
        mockMvc.perform(get("/api/admin/monitor-bookings")
                .param("startDate", "2024-01-01")
                .param("endDate", "2024-01-31")
                .param("hotelId", "0"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Booking monitoring data retrieved successfully"))
                .andExpect(jsonPath("$.data.totalBookings").value(100))
                .andExpect(jsonPath("$.data.totalRevenue").value(50000.0))
                .andExpect(jsonPath("$.data.totalGuests").value(200.0))
                .andExpect(jsonPath("$.data.totalRoomsBooked").value(150.0))
                .andExpect(jsonPath("$.data.bookingsByStatus.CONFIRMED").value(70))
                .andExpect(jsonPath("$.data.bookingsByStatus.PENDING").value(30))
                .andExpect(jsonPath("$.data.bookingsByPaymentStatus.paid").value(80))
                .andExpect(jsonPath("$.data.bookingsByPaymentStatus.unpaid").value(20));

        verify(adminService).monitorBookings(startDate, endDate, hotelId);
    }

    @Test
    @DisplayName("Monitor bookings - specific hotel - success")
    void testMonitorBookings_SpecificHotel_Success() throws Exception {
        // Arrange
        LocalDate startDate = LocalDate.of(2024, 1, 1);
        LocalDate endDate = LocalDate.of(2024, 1, 31);
        long hotelId = 1L;

        BookingMonitoringResponse response = BookingMonitoringResponse.builder()
                .totalBookings(50)
                .totalRevenue(25000.0)
                .totalGuests(100.0)
                .totalRoomsBooked(75.0)
                .bookingsByStatus(Map.of("CONFIRMED", 50))
                .bookingsByPaymentStatus(Map.of("paid", 50))
                .bookingsByHotel(new ArrayList<>())
                .bookingsByPaymentMethod(new ArrayList<>())
                .dailyBookings(new ArrayList<>())
                .build();

        when(adminService.monitorBookings(startDate, endDate, hotelId)).thenReturn(response);

        // Act & Assert
        mockMvc.perform(get("/api/admin/monitor-bookings")
                .param("startDate", "2024-01-01")
                .param("endDate", "2024-01-31")
                .param("hotelId", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.totalBookings").value(50))
                .andExpect(jsonPath("$.data.totalRevenue").value(25000.0));

        verify(adminService).monitorBookings(startDate, endDate, hotelId);
    }

    @Test
    @DisplayName("Monitor bookings - default hotelId when not provided")
    void testMonitorBookings_DefaultHotelId() throws Exception {
        // Arrange
        LocalDate startDate = LocalDate.of(2024, 1, 1);
        LocalDate endDate = LocalDate.of(2024, 1, 31);
        long defaultHotelId = 0L;

        BookingMonitoringResponse response = BookingMonitoringResponse.builder()
                .totalBookings(100)
                .totalRevenue(50000.0)
                .totalGuests(200.0)
                .totalRoomsBooked(150.0)
                .bookingsByStatus(new HashMap<>())
                .bookingsByPaymentStatus(new HashMap<>())
                .bookingsByHotel(new ArrayList<>())
                .bookingsByPaymentMethod(new ArrayList<>())
                .dailyBookings(new ArrayList<>())
                .build();

        when(adminService.monitorBookings(startDate, endDate, defaultHotelId)).thenReturn(response);

        // Act & Assert - hotelId not provided, should default to 0
        mockMvc.perform(get("/api/admin/monitor-bookings")
                .param("startDate", "2024-01-01")
                .param("endDate", "2024-01-31"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        verify(adminService).monitorBookings(startDate, endDate, defaultHotelId);
    }

    @Test
    @DisplayName("Monitor bookings - invalid date format")
    void testMonitorBookings_InvalidDateFormat() throws Exception {
        // Act & Assert
        mockMvc.perform(get("/api/admin/monitor-bookings")
                .param("startDate", "invalid-date")
                .param("endDate", "2024-01-31")
                .param("hotelId", "0"))
                .andExpect(status().is5xxServerError());  // Spring converts parse errors to 500

        verify(adminService, never()).monitorBookings(any(), any(), anyLong());
    }

    // ==================== monitorFlights Tests ====================

    @Test
    @DisplayName("Monitor flights - all airlines - success")
    void testMonitorFlights_AllAirlines_Success() throws Exception {
        // Arrange
        LocalDate startDate = LocalDate.of(2024, 1, 1);
        LocalDate endDate = LocalDate.of(2024, 1, 31);
        long airlineId = 0L;

        FlightMonitoringResponse response = FlightMonitoringResponse.builder()
                .totalTickets(200)
                .totalRevenue(100000.0)
                .ticketsByPaymentStatus(Map.of("paid", 150, "unpaid", 50))
                .ticketsByAirline(new ArrayList<>())
                .flightsByStatus(Map.of("SCHEDULED", 120, "COMPLETED", 80))
                .paymentsByStatus(Map.of("COMPLETED", 150, "PENDING", 50))
                .paymentsByMethod(new ArrayList<>())
                .dailyTickets(new ArrayList<>())
                .build();

        when(adminService.monitorFlightTransactions(startDate, endDate, airlineId)).thenReturn(response);

        // Act & Assert
        mockMvc.perform(get("/api/admin/monitor-flights")
                .param("startDate", "2024-01-01")
                .param("endDate", "2024-01-31")
                .param("airlineId", "0"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Flight monitoring data retrieved successfully"))
                .andExpect(jsonPath("$.data.totalTickets").value(200))
                .andExpect(jsonPath("$.data.totalRevenue").value(100000.0))
                .andExpect(jsonPath("$.data.ticketsByPaymentStatus.paid").value(150))
                .andExpect(jsonPath("$.data.ticketsByPaymentStatus.unpaid").value(50))
                .andExpect(jsonPath("$.data.flightsByStatus.SCHEDULED").value(120))
                .andExpect(jsonPath("$.data.flightsByStatus.COMPLETED").value(80));

        verify(adminService).monitorFlightTransactions(startDate, endDate, airlineId);
    }

    @Test
    @DisplayName("Monitor flights - specific airline - success")
    void testMonitorFlights_SpecificAirline_Success() throws Exception {
        // Arrange
        LocalDate startDate = LocalDate.of(2024, 1, 1);
        LocalDate endDate = LocalDate.of(2024, 1, 31);
        long airlineId = 1L;

        FlightMonitoringResponse response = FlightMonitoringResponse.builder()
                .totalTickets(100)
                .totalRevenue(50000.0)
                .ticketsByPaymentStatus(Map.of("paid", 100))
                .ticketsByAirline(new ArrayList<>())
                .flightsByStatus(Map.of("SCHEDULED", 100))
                .paymentsByStatus(Map.of("COMPLETED", 100))
                .paymentsByMethod(new ArrayList<>())
                .dailyTickets(new ArrayList<>())
                .build();

        when(adminService.monitorFlightTransactions(startDate, endDate, airlineId)).thenReturn(response);

        // Act & Assert
        mockMvc.perform(get("/api/admin/monitor-flights")
                .param("startDate", "2024-01-01")
                .param("endDate", "2024-01-31")
                .param("airlineId", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.totalTickets").value(100))
                .andExpect(jsonPath("$.data.totalRevenue").value(50000.0));

        verify(adminService).monitorFlightTransactions(startDate, endDate, airlineId);
    }

    @Test
    @DisplayName("Monitor flights - default airlineId when not provided")
    void testMonitorFlights_DefaultAirlineId() throws Exception {
        // Arrange
        LocalDate startDate = LocalDate.of(2024, 1, 1);
        LocalDate endDate = LocalDate.of(2024, 1, 31);
        long defaultAirlineId = 0L;

        FlightMonitoringResponse response = FlightMonitoringResponse.builder()
                .totalTickets(200)
                .totalRevenue(100000.0)
                .ticketsByPaymentStatus(new HashMap<>())
                .ticketsByAirline(new ArrayList<>())
                .flightsByStatus(new HashMap<>())
                .paymentsByStatus(new HashMap<>())
                .paymentsByMethod(new ArrayList<>())
                .dailyTickets(new ArrayList<>())
                .build();

        when(adminService.monitorFlightTransactions(startDate, endDate, defaultAirlineId)).thenReturn(response);

        // Act & Assert - airlineId not provided, should default to 0
        mockMvc.perform(get("/api/admin/monitor-flights")
                .param("startDate", "2024-01-01")
                .param("endDate", "2024-01-31"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        verify(adminService).monitorFlightTransactions(startDate, endDate, defaultAirlineId);
    }

    @Test
    @DisplayName("Monitor flights - invalid date format")
    void testMonitorFlights_InvalidDateFormat() throws Exception {
        // Act & Assert
        mockMvc.perform(get("/api/admin/monitor-flights")
                .param("startDate", "invalid-date")
                .param("endDate", "2024-01-31")
                .param("airlineId", "0"))
                .andExpect(status().is5xxServerError());  // Spring converts parse errors to 500

        verify(adminService, never()).monitorFlightTransactions(any(), any(), anyLong());
    }

    // ==================== getAllHotels Tests ====================

    @Test
    @DisplayName("Get all hotels - success")
    void testGetAllHotels_Success() throws Exception {
        // Arrange
        List<PartnerShipNameResponse> hotels = Arrays.asList(
                new PartnerShipNameResponse(1, "Hotel A"),
                new PartnerShipNameResponse(2, "Hotel B"),
                new PartnerShipNameResponse(3, "Hotel C")
        );

        when(adminService.getAllHotels()).thenReturn(hotels);

        // Act & Assert
        mockMvc.perform(get("/api/admin/hotels"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Hotels retrieved successfully"))
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data.length()").value(3))
                .andExpect(jsonPath("$.data[0].id").value(1))
                .andExpect(jsonPath("$.data[0].name").value("Hotel A"))
                .andExpect(jsonPath("$.data[1].id").value(2))
                .andExpect(jsonPath("$.data[1].name").value("Hotel B"))
                .andExpect(jsonPath("$.data[2].id").value(3))
                .andExpect(jsonPath("$.data[2].name").value("Hotel C"));

        verify(adminService).getAllHotels();
    }

    @Test
    @DisplayName("Get all hotels - empty list")
    void testGetAllHotels_EmptyList() throws Exception {
        // Arrange
        when(adminService.getAllHotels()).thenReturn(new ArrayList<>());

        // Act & Assert
        mockMvc.perform(get("/api/admin/hotels"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data.length()").value(0));

        verify(adminService).getAllHotels();
    }

    // ==================== getAllAirlines Tests ====================

    @Test
    @DisplayName("Get all airlines - success")
    void testGetAllAirlines_Success() throws Exception {
        // Arrange
        List<PartnerShipNameResponse> airlines = Arrays.asList(
                new PartnerShipNameResponse(1, "Airline A"),
                new PartnerShipNameResponse(2, "Airline B")
        );

        when(adminService.getAllAirlines()).thenReturn(airlines);

        // Act & Assert
        mockMvc.perform(get("/api/admin/airlines"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Airlines retrieved successfully"))
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data.length()").value(2))
                .andExpect(jsonPath("$.data[0].id").value(1))
                .andExpect(jsonPath("$.data[0].name").value("Airline A"))
                .andExpect(jsonPath("$.data[1].id").value(2))
                .andExpect(jsonPath("$.data[1].name").value("Airline B"));

        verify(adminService).getAllAirlines();
    }

    @Test
    @DisplayName("Get all airlines - empty list")
    void testGetAllAirlines_EmptyList() throws Exception {
        // Arrange
        when(adminService.getAllAirlines()).thenReturn(new ArrayList<>());

        // Act & Assert
        mockMvc.perform(get("/api/admin/airlines"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data.length()").value(0));

        verify(adminService).getAllAirlines();
    }

    // ==================== Edge Cases ====================

    @Test
    @DisplayName("Monitor bookings - same day date range")
    void testMonitorBookings_SameDayRange() throws Exception {
        // Arrange
        LocalDate sameDate = LocalDate.of(2024, 1, 15);

        BookingMonitoringResponse response = BookingMonitoringResponse.builder()
                .totalBookings(10)
                .totalRevenue(5000.0)
                .totalGuests(20.0)
                .totalRoomsBooked(15.0)
                .bookingsByStatus(new HashMap<>())
                .bookingsByPaymentStatus(new HashMap<>())
                .bookingsByHotel(new ArrayList<>())
                .bookingsByPaymentMethod(new ArrayList<>())
                .dailyBookings(new ArrayList<>())
                .build();

        when(adminService.monitorBookings(sameDate, sameDate, 0L)).thenReturn(response);

        // Act & Assert
        mockMvc.perform(get("/api/admin/monitor-bookings")
                .param("startDate", "2024-01-15")
                .param("endDate", "2024-01-15"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.totalBookings").value(10));

        verify(adminService).monitorBookings(sameDate, sameDate, 0L);
    }

    @Test
    @DisplayName("Monitor flights - same day date range")
    void testMonitorFlights_SameDayRange() throws Exception {
        // Arrange
        LocalDate sameDate = LocalDate.of(2024, 1, 15);

        FlightMonitoringResponse response = FlightMonitoringResponse.builder()
                .totalTickets(20)
                .totalRevenue(10000.0)
                .ticketsByPaymentStatus(new HashMap<>())
                .ticketsByAirline(new ArrayList<>())
                .flightsByStatus(new HashMap<>())
                .paymentsByStatus(new HashMap<>())
                .paymentsByMethod(new ArrayList<>())
                .dailyTickets(new ArrayList<>())
                .build();

        when(adminService.monitorFlightTransactions(sameDate, sameDate, 0L)).thenReturn(response);

        // Act & Assert
        mockMvc.perform(get("/api/admin/monitor-flights")
                .param("startDate", "2024-01-15")
                .param("endDate", "2024-01-15"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.totalTickets").value(20));

        verify(adminService).monitorFlightTransactions(sameDate, sameDate, 0L);
    }

    @Test
    @DisplayName("Monitor bookings - missing required parameters")
    void testMonitorBookings_MissingParameters() throws Exception {
        // Act & Assert - missing startDate
        mockMvc.perform(get("/api/admin/monitor-bookings")
                .param("endDate", "2024-01-31"))
                .andExpect(status().is5xxServerError());

        // missing endDate
        mockMvc.perform(get("/api/admin/monitor-bookings")
                .param("startDate", "2024-01-01"))
                .andExpect(status().is5xxServerError());

        verify(adminService, never()).monitorBookings(any(), any(), anyLong());
    }

    @Test
    @DisplayName("Monitor flights - missing required parameters")
    void testMonitorFlights_MissingParameters() throws Exception {
        // Act & Assert - missing startDate
        mockMvc.perform(get("/api/admin/monitor-flights")
                .param("endDate", "2024-01-31"))
                .andExpect(status().is5xxServerError());

        // missing endDate
        mockMvc.perform(get("/api/admin/monitor-flights")
                .param("startDate", "2024-01-01"))
                .andExpect(status().is5xxServerError());

        verify(adminService, never()).monitorFlightTransactions(any(), any(), anyLong());
    }
}

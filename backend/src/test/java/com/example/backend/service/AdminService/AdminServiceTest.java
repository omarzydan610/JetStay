package com.example.backend.service.AdminService;

import com.example.backend.dto.AdminDTO.BookingMonitoringResponse;
import com.example.backend.dto.AdminDTO.FlightMonitoringResponse;
import com.example.backend.dto.AdminDTO.PartnerShipNameResponse;
import com.example.backend.dto.AdminDTO.DatabaseDTO.CountByStateDTO;
import com.example.backend.entity.BookingTransaction;
import com.example.backend.repository.AirlineRepository;
import com.example.backend.repository.BookingTransactionRepository;
import com.example.backend.repository.FlightTicketRepository;
import com.example.backend.repository.HotelRepository;
import com.example.backend.repository.TicketPaymentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDate;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AdminServiceTest {

    @Mock
    private BookingTransactionRepository bookingTransactionRepository;

    @Mock
    private FlightTicketRepository flightTicketRepository;

    @Mock
    private TicketPaymentRepository ticketPaymentRepository;

    @Mock
    private AirlineRepository airlineRepository;

    @Mock
    private HotelRepository hotelRepository;

    @InjectMocks
    private AdminService adminService;

    private LocalDate startDate;
    private LocalDate endDate;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        startDate = LocalDate.of(2024, 1, 1);
        endDate = LocalDate.of(2024, 1, 31);
    }

    // ==================== monitorBookings Tests ====================

    @Test
    @DisplayName("Monitor bookings for all hotels - success")
    void testMonitorBookings_AllHotels_Success() {
        // Arrange
        long hotelId = 0L;

        // Mock booking stats
        List<Object[]> bookingStats = new ArrayList<>();
        bookingStats.add(new Object[]{100L, 50000.0, 200L, 150L});
        when(bookingTransactionRepository.getTotalBookingsCountBetweenDate(startDate, endDate))
            .thenReturn(bookingStats);

        // Mock booking status
        List<CountByStateDTO> statusList = Arrays.asList(
            new CountByStateDTO(BookingTransaction.Status.CONFIRMED, 70L),
            new CountByStateDTO(BookingTransaction.Status.PENDING, 30L)
        );
        when(bookingTransactionRepository.getBookingCountsByStatusBetweenDate(startDate, endDate))
            .thenReturn(statusList);

        // Mock hotel stats
        List<Object[]> hotelStats = Arrays.asList(
            new Object[]{1, "Hotel A", 50L, 25000.0},
            new Object[]{2, "Hotel B", 50L, 25000.0}
        );
        when(bookingTransactionRepository.getBookingCountsAndRevenueByHotelBetweenDate(startDate, endDate))
            .thenReturn(hotelStats);

        // Mock daily bookings
        List<Object[]> dailyStats = Arrays.asList(
            new Object[]{LocalDate.of(2024, 1, 1), 10L, 5000.0},
            new Object[]{LocalDate.of(2024, 1, 2), 15L, 7500.0}
        );
        when(bookingTransactionRepository.getDailyBookingSummary(startDate, endDate))
            .thenReturn(dailyStats);

        // Mock payment methods
        List<Object[]> paymentMethods = Arrays.asList(
            new Object[]{1, "Credit Card", 60L, 30000.0},
            new Object[]{2, "PayPal", 40L, 20000.0}
        );
        when(bookingTransactionRepository.getBookingCountsAndRevenueByPaymentMethod(startDate, endDate))
            .thenReturn(paymentMethods);

        // Mock payment status
        List<Object[]> paymentStatus = Arrays.asList(
            new Object[]{true, 80L},
            new Object[]{false, 20L}
        );
        when(bookingTransactionRepository.getBookingCountsByPaymentStatusBetweenDate(startDate, endDate))
            .thenReturn(paymentStatus);

        // Act
        BookingMonitoringResponse response = adminService.monitorBookings(startDate, endDate, hotelId);

        // Assert
        assertNotNull(response);
        assertEquals(100, response.getTotalBookings());
        assertEquals(50000.0, response.getTotalRevenue());
        assertEquals(200.0, response.getTotalGuests());
        assertEquals(150.0, response.getTotalRoomsBooked());

        assertEquals(2, response.getBookingsByStatus().size());
        assertEquals(70, response.getBookingsByStatus().get("CONFIRMED"));
        assertEquals(30, response.getBookingsByStatus().get("PENDING"));

        assertEquals(2, response.getBookingsByPaymentStatus().size());
        assertEquals(80, response.getBookingsByPaymentStatus().get("paid"));
        assertEquals(20, response.getBookingsByPaymentStatus().get("unpaid"));

        assertEquals(2, response.getBookingsByHotel().size());
        assertEquals(2, response.getBookingsByPaymentMethod().size());
        assertEquals(2, response.getDailyBookings().size());

        // Verify interactions
        verify(bookingTransactionRepository).getTotalBookingsCountBetweenDate(startDate, endDate);
        verify(bookingTransactionRepository).getBookingCountsByStatusBetweenDate(startDate, endDate);
        verify(bookingTransactionRepository).getBookingCountsAndRevenueByHotelBetweenDate(startDate, endDate);
        verify(bookingTransactionRepository).getDailyBookingSummary(startDate, endDate);
        verify(bookingTransactionRepository).getBookingCountsAndRevenueByPaymentMethod(startDate, endDate);
        verify(bookingTransactionRepository).getBookingCountsByPaymentStatusBetweenDate(startDate, endDate);
    }

    @Test
    @DisplayName("Monitor bookings for specific hotel - success")
    void testMonitorBookings_SpecificHotel_Success() {
        // Arrange
        long hotelId = 1L;

        List<Object[]> bookingStats = new ArrayList<>();
        bookingStats.add(new Object[]{50L, 25000.0, 100L, 75L});
        when(bookingTransactionRepository.getTotalBookingsCountBetweenDateAndHotel(startDate, endDate, hotelId))
            .thenReturn(bookingStats);

        List<CountByStateDTO> statusList = Arrays.asList(
            new CountByStateDTO(BookingTransaction.Status.CONFIRMED, 50L)
        );
        when(bookingTransactionRepository.getBookingCountsByStatusBetweenDateAndHotel(startDate, endDate, hotelId))
            .thenReturn(statusList);

        List<Object[]> hotelStats = new ArrayList<>();
        hotelStats.add(new Object[]{1, "Hotel A", 50L, 25000.0});
        when(bookingTransactionRepository.getBookingCountsAndRevenueByHotelBetweenDateAndHotel(startDate, endDate, hotelId))
            .thenReturn(hotelStats);

        List<Object[]> dailyStats = new ArrayList<>();
        dailyStats.add(new Object[]{LocalDate.of(2024, 1, 1), 10L, 5000.0});
        when(bookingTransactionRepository.getDailyBookingSummaryByHotel(startDate, endDate, hotelId))
            .thenReturn(dailyStats);

        List<Object[]> paymentMethods = new ArrayList<>();
        paymentMethods.add(new Object[]{1, "Credit Card", 50L, 25000.0});
        when(bookingTransactionRepository.getBookingCountsAndRevenueByPaymentMethodAndHotel(startDate, endDate, hotelId))
            .thenReturn(paymentMethods);

        List<Object[]> paymentStatus = new ArrayList<>();
        paymentStatus.add(new Object[]{true, 50L});
        when(bookingTransactionRepository.getBookingCountsByPaymentStatusBetweenDateAndHotel(startDate, endDate, hotelId))
            .thenReturn(paymentStatus);

        // Act
        BookingMonitoringResponse response = adminService.monitorBookings(startDate, endDate, hotelId);

        // Assert
        assertNotNull(response);
        assertEquals(50, response.getTotalBookings());
        assertEquals(25000.0, response.getTotalRevenue());

        // Verify hotel-specific methods were called
        verify(bookingTransactionRepository).getTotalBookingsCountBetweenDateAndHotel(startDate, endDate, hotelId);
        verify(bookingTransactionRepository).getBookingCountsByStatusBetweenDateAndHotel(startDate, endDate, hotelId);
        verify(bookingTransactionRepository).getBookingCountsAndRevenueByHotelBetweenDateAndHotel(startDate, endDate, hotelId);
        verify(bookingTransactionRepository).getDailyBookingSummaryByHotel(startDate, endDate, hotelId);
        verify(bookingTransactionRepository).getBookingCountsAndRevenueByPaymentMethodAndHotel(startDate, endDate, hotelId);
        verify(bookingTransactionRepository).getBookingCountsByPaymentStatusBetweenDateAndHotel(startDate, endDate, hotelId);
    }

    @Test
    @DisplayName("Monitor bookings with empty results")
    void testMonitorBookings_EmptyResults() {
        // Arrange
        long hotelId = 0L;

        when(bookingTransactionRepository.getTotalBookingsCountBetweenDate(startDate, endDate))
            .thenReturn(new ArrayList<>());
        when(bookingTransactionRepository.getBookingCountsByStatusBetweenDate(startDate, endDate))
            .thenReturn(new ArrayList<>());
        when(bookingTransactionRepository.getBookingCountsAndRevenueByHotelBetweenDate(startDate, endDate))
            .thenReturn(new ArrayList<>());
        when(bookingTransactionRepository.getDailyBookingSummary(startDate, endDate))
            .thenReturn(new ArrayList<>());
        when(bookingTransactionRepository.getBookingCountsAndRevenueByPaymentMethod(startDate, endDate))
            .thenReturn(new ArrayList<>());
        when(bookingTransactionRepository.getBookingCountsByPaymentStatusBetweenDate(startDate, endDate))
            .thenReturn(new ArrayList<>());

        // Act
        BookingMonitoringResponse response = adminService.monitorBookings(startDate, endDate, hotelId);

        // Assert
        assertNotNull(response);
        assertEquals(0, response.getTotalBookings()); // Default value from empty result
        assertEquals(0.0, response.getTotalRevenue());
        assertEquals(0, response.getBookingsByHotel().size());
        assertEquals(0, response.getDailyBookings().size());
    }

    @Test
    @DisplayName("Monitor bookings with null values in aggregations")
    void testMonitorBookings_NullValues() {
        // Arrange
        long hotelId = 0L;

        List<Object[]> bookingStats = new ArrayList<>();
        bookingStats.add(new Object[]{10L, null, null, null});  // Null revenue, guests, rooms
        when(bookingTransactionRepository.getTotalBookingsCountBetweenDate(startDate, endDate))
            .thenReturn(bookingStats);

        when(bookingTransactionRepository.getBookingCountsByStatusBetweenDate(startDate, endDate))
            .thenReturn(new ArrayList<>());
        when(bookingTransactionRepository.getBookingCountsAndRevenueByHotelBetweenDate(startDate, endDate))
            .thenReturn(new ArrayList<>());
        when(bookingTransactionRepository.getDailyBookingSummary(startDate, endDate))
            .thenReturn(new ArrayList<>());
        when(bookingTransactionRepository.getBookingCountsAndRevenueByPaymentMethod(startDate, endDate))
            .thenReturn(new ArrayList<>());
        when(bookingTransactionRepository.getBookingCountsByPaymentStatusBetweenDate(startDate, endDate))
            .thenReturn(new ArrayList<>());

        // Act
        BookingMonitoringResponse response = adminService.monitorBookings(startDate, endDate, hotelId);

        // Assert
        assertNotNull(response);
        assertEquals(10, response.getTotalBookings());
        assertEquals(0.0, response.getTotalRevenue());  // Should default to 0.0
        assertEquals(0.0, response.getTotalGuests());
        assertEquals(0.0, response.getTotalRoomsBooked());
    }

    // ==================== monitorFlightTransactions Tests ====================

    @Test
    @DisplayName("Monitor flights for all airlines - success")
    void testMonitorFlightTransactions_AllAirlines_Success() {
        // Arrange
        long airlineId = 0L;

        List<Object[]> ticketStats = new ArrayList<>();
        ticketStats.add(new Object[]{200L, 100000.0});
        when(flightTicketRepository.getTotalTicketsCountBetweenDate(startDate, endDate))
            .thenReturn(ticketStats);

        List<Object[]> ticketPaymentStatus = Arrays.asList(
            new Object[]{true, 150L},
            new Object[]{false, 50L}
        );
        when(flightTicketRepository.getTicketCountsByPaymentStatusBetweenDate(startDate, endDate))
            .thenReturn(ticketPaymentStatus);

        List<Object[]> airlineStats = Arrays.asList(
            new Object[]{1, "Airline A", 100L, 50000.0},
            new Object[]{2, "Airline B", 100L, 50000.0}
        );
        when(flightTicketRepository.getTicketCountsAndRevenueByAirlineBetweenDate(startDate, endDate))
            .thenReturn(airlineStats);

        List<Object[]> flightStatus = Arrays.asList(
            new Object[]{"SCHEDULED", 120L},
            new Object[]{"COMPLETED", 80L}
        );
        when(flightTicketRepository.getFlightCountsByStatusBetweenDate(startDate, endDate))
            .thenReturn(flightStatus);

        List<Object[]> paymentStatusTicket = Arrays.asList(
            new Object[]{"COMPLETED", 150L},
            new Object[]{"PENDING", 50L}
        );
        when(ticketPaymentRepository.getPaymentCountsByStatusBetweenDate(startDate, endDate))
            .thenReturn(paymentStatusTicket);

        List<Object[]> paymentMethods = Arrays.asList(
            new Object[]{"Credit Card", 120L, 60000.0},
            new Object[]{"PayPal", 80L, 40000.0}
        );
        when(ticketPaymentRepository.getTicketPaymentCountsAndRevenueByMethodBetweenDate(startDate, endDate))
            .thenReturn(paymentMethods);

        List<Object[]> dailyStats = Arrays.asList(
            new Object[]{LocalDate.of(2024, 1, 1), 20L, 10000.0},
            new Object[]{LocalDate.of(2024, 1, 2), 30L, 15000.0}
        );
        when(flightTicketRepository.getDailyTicketSalesSummary(startDate, endDate))
            .thenReturn(dailyStats);

        // Act
        FlightMonitoringResponse response = adminService.monitorFlightTransactions(startDate, endDate, airlineId);

        // Assert
        assertNotNull(response);
        assertEquals(200, response.getTotalTickets());
        assertEquals(100000.0, response.getTotalRevenue());

        assertEquals(2, response.getTicketsByPaymentStatus().size());
        assertEquals(150, response.getTicketsByPaymentStatus().get("paid"));
        assertEquals(50, response.getTicketsByPaymentStatus().get("unpaid"));

        assertEquals(2, response.getTicketsByAirline().size());
        assertEquals(2, response.getFlightsByStatus().size());
        assertEquals(2, response.getPaymentsByStatus().size());
        assertEquals(2, response.getPaymentsByMethod().size());
        assertEquals(2, response.getDailyTickets().size());

        // Verify interactions
        verify(flightTicketRepository).getTotalTicketsCountBetweenDate(startDate, endDate);
        verify(flightTicketRepository).getTicketCountsByPaymentStatusBetweenDate(startDate, endDate);
        verify(flightTicketRepository).getTicketCountsAndRevenueByAirlineBetweenDate(startDate, endDate);
        verify(flightTicketRepository).getFlightCountsByStatusBetweenDate(startDate, endDate);
        verify(ticketPaymentRepository).getPaymentCountsByStatusBetweenDate(startDate, endDate);
        verify(ticketPaymentRepository).getTicketPaymentCountsAndRevenueByMethodBetweenDate(startDate, endDate);
        verify(flightTicketRepository).getDailyTicketSalesSummary(startDate, endDate);
    }

    @Test
    @DisplayName("Monitor flights for specific airline - success")
    void testMonitorFlightTransactions_SpecificAirline_Success() {
        // Arrange
        long airlineId = 1L;

        List<Object[]> ticketStats = new ArrayList<>();
        ticketStats.add(new Object[]{100L, 50000.0});
        when(flightTicketRepository.getTotalTicketsCountBetweenDateAndAirline(startDate, endDate, airlineId))
            .thenReturn(ticketStats);

        List<Object[]> ticketPaymentStatus = new ArrayList<>();
        ticketPaymentStatus.add(new Object[]{true, 100L});
        when(flightTicketRepository.getTicketCountsByPaymentStatusBetweenDateAndAirline(startDate, endDate, airlineId))
            .thenReturn(ticketPaymentStatus);

        List<Object[]> airlineStats = new ArrayList<>();
        airlineStats.add(new Object[]{1, "Airline A", 100L, 50000.0});
        when(flightTicketRepository.getTicketCountsAndRevenueByAirlineBetweenDateAndAirline(startDate, endDate, airlineId))
            .thenReturn(airlineStats);

        List<Object[]> flightStatus = new ArrayList<>();
        flightStatus.add(new Object[]{"SCHEDULED", 100L});
        when(flightTicketRepository.getFlightCountsByStatusBetweenDateAndAirline(startDate, endDate, airlineId))
            .thenReturn(flightStatus);

        List<Object[]> paymentStatusTicket = new ArrayList<>();
        paymentStatusTicket.add(new Object[]{"COMPLETED", 100L});
        when(ticketPaymentRepository.getPaymentCountsByStatusBetweenDateAndAirline(startDate, endDate, airlineId))
            .thenReturn(paymentStatusTicket);

        List<Object[]> paymentMethods = new ArrayList<>();
        paymentMethods.add(new Object[]{"Credit Card", 100L, 50000.0});
        when(ticketPaymentRepository.getTicketPaymentCountsAndRevenueByMethodBetweenDateAndAirline(startDate, endDate, airlineId))
            .thenReturn(paymentMethods);

        List<Object[]> dailyStats = new ArrayList<>();
        dailyStats.add(new Object[]{LocalDate.of(2024, 1, 1), 20L, 10000.0});
        when(flightTicketRepository.getDailyTicketSalesSummaryByAirline(startDate, endDate, airlineId))
            .thenReturn(dailyStats);

        // Act
        FlightMonitoringResponse response = adminService.monitorFlightTransactions(startDate, endDate, airlineId);

        // Assert
        assertNotNull(response);
        assertEquals(100, response.getTotalTickets());
        assertEquals(50000.0, response.getTotalRevenue());

        // Verify airline-specific methods were called
        verify(flightTicketRepository).getTotalTicketsCountBetweenDateAndAirline(startDate, endDate, airlineId);
        verify(flightTicketRepository).getTicketCountsByPaymentStatusBetweenDateAndAirline(startDate, endDate, airlineId);
        verify(flightTicketRepository).getTicketCountsAndRevenueByAirlineBetweenDateAndAirline(startDate, endDate, airlineId);
        verify(flightTicketRepository).getFlightCountsByStatusBetweenDateAndAirline(startDate, endDate, airlineId);
        verify(ticketPaymentRepository).getPaymentCountsByStatusBetweenDateAndAirline(startDate, endDate, airlineId);
        verify(ticketPaymentRepository).getTicketPaymentCountsAndRevenueByMethodBetweenDateAndAirline(startDate, endDate, airlineId);
        verify(flightTicketRepository).getDailyTicketSalesSummaryByAirline(startDate, endDate, airlineId);
    }

    @Test
    @DisplayName("Monitor flights with empty results")
    void testMonitorFlightTransactions_EmptyResults() {
        // Arrange
        long airlineId = 0L;

        List<Object[]> emptyTicketStats = new ArrayList<>();
        emptyTicketStats.add(new Object[]{0L, 0.0});
        when(flightTicketRepository.getTotalTicketsCountBetweenDate(startDate, endDate))
            .thenReturn(emptyTicketStats);
        when(flightTicketRepository.getTicketCountsByPaymentStatusBetweenDate(startDate, endDate))
            .thenReturn(new ArrayList<>());
        when(flightTicketRepository.getTicketCountsAndRevenueByAirlineBetweenDate(startDate, endDate))
            .thenReturn(new ArrayList<>());
        when(flightTicketRepository.getFlightCountsByStatusBetweenDate(startDate, endDate))
            .thenReturn(new ArrayList<>());
        when(ticketPaymentRepository.getPaymentCountsByStatusBetweenDate(startDate, endDate))
            .thenReturn(new ArrayList<>());
        when(ticketPaymentRepository.getTicketPaymentCountsAndRevenueByMethodBetweenDate(startDate, endDate))
            .thenReturn(new ArrayList<>());
        when(flightTicketRepository.getDailyTicketSalesSummary(startDate, endDate))
            .thenReturn(new ArrayList<>());

        // Act
        FlightMonitoringResponse response = adminService.monitorFlightTransactions(startDate, endDate, airlineId);

        // Assert
        assertNotNull(response);
        assertEquals(0, response.getTotalTickets());
        assertEquals(0.0, response.getTotalRevenue());
        assertEquals(0, response.getTicketsByAirline().size());
        assertEquals(0, response.getDailyTickets().size());
    }

    // ==================== getAllHotels Tests ====================

    @Test
    @DisplayName("Get all hotels - success")
    void testGetAllHotels_Success() {
        // Arrange
        List<PartnerShipNameResponse> expectedHotels = Arrays.asList(
            new PartnerShipNameResponse(1, "Hotel A"),
            new PartnerShipNameResponse(2, "Hotel B"),
            new PartnerShipNameResponse(3, "Hotel C")
        );
        when(hotelRepository.findAllHotel()).thenReturn(expectedHotels);

        // Act
        List<PartnerShipNameResponse> result = adminService.getAllHotels();

        // Assert
        assertNotNull(result);
        assertEquals(3, result.size());
        assertEquals("Hotel A", result.get(0).getName());
        assertEquals("Hotel B", result.get(1).getName());
        assertEquals("Hotel C", result.get(2).getName());

        verify(hotelRepository).findAllHotel();
    }

    @Test
    @DisplayName("Get all hotels - empty list")
    void testGetAllHotels_EmptyList() {
        // Arrange
        when(hotelRepository.findAllHotel()).thenReturn(new ArrayList<>());

        // Act
        List<PartnerShipNameResponse> result = adminService.getAllHotels();

        // Assert
        assertNotNull(result);
        assertEquals(0, result.size());

        verify(hotelRepository).findAllHotel();
    }

    // ==================== getAllAirlines Tests ====================

    @Test
    @DisplayName("Get all airlines - success")
    void testGetAllAirlines_Success() {
        // Arrange
        List<PartnerShipNameResponse> expectedAirlines = Arrays.asList(
            new PartnerShipNameResponse(1, "Airline A"),
            new PartnerShipNameResponse(2, "Airline B")
        );
        when(airlineRepository.findAllAirline()).thenReturn(expectedAirlines);

        // Act
        List<PartnerShipNameResponse> result = adminService.getAllAirlines();

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("Airline A", result.get(0).getName());
        assertEquals("Airline B", result.get(1).getName());

        verify(airlineRepository).findAllAirline();
    }

    @Test
    @DisplayName("Get all airlines - empty list")
    void testGetAllAirlines_EmptyList() {
        // Arrange
        when(airlineRepository.findAllAirline()).thenReturn(new ArrayList<>());

        // Act
        List<PartnerShipNameResponse> result = adminService.getAllAirlines();

        // Assert
        assertNotNull(result);
        assertEquals(0, result.size());

        verify(airlineRepository).findAllAirline();
    }

    // ==================== Edge Cases ====================

    @Test
    @DisplayName("Monitor bookings with multiple booking statuses")
    void testMonitorBookings_MultipleStatuses() {
        // Arrange
        long hotelId = 0L;

        List<Object[]> bookingStats = new ArrayList<>();
        bookingStats.add(new Object[]{100L, 50000.0, 200L, 150L});
        when(bookingTransactionRepository.getTotalBookingsCountBetweenDate(startDate, endDate))
            .thenReturn(bookingStats);

        List<CountByStateDTO> statusList = Arrays.asList(
            new CountByStateDTO(BookingTransaction.Status.CONFIRMED, 40L),
            new CountByStateDTO(BookingTransaction.Status.PENDING, 30L),
            new CountByStateDTO(BookingTransaction.Status.CANCELLED, 20L),
            new CountByStateDTO(BookingTransaction.Status.COMPLETED, 10L)
        );
        when(bookingTransactionRepository.getBookingCountsByStatusBetweenDate(startDate, endDate))
            .thenReturn(statusList);

        when(bookingTransactionRepository.getBookingCountsAndRevenueByHotelBetweenDate(startDate, endDate))
            .thenReturn(new ArrayList<>());
        when(bookingTransactionRepository.getDailyBookingSummary(startDate, endDate))
            .thenReturn(new ArrayList<>());
        when(bookingTransactionRepository.getBookingCountsAndRevenueByPaymentMethod(startDate, endDate))
            .thenReturn(new ArrayList<>());
        when(bookingTransactionRepository.getBookingCountsByPaymentStatusBetweenDate(startDate, endDate))
            .thenReturn(new ArrayList<>());

        // Act
        BookingMonitoringResponse response = adminService.monitorBookings(startDate, endDate, hotelId);

        // Assert
        assertNotNull(response);
        assertEquals(4, response.getBookingsByStatus().size());
        assertEquals(40, response.getBookingsByStatus().get("CONFIRMED"));
        assertEquals(30, response.getBookingsByStatus().get("PENDING"));
        assertEquals(20, response.getBookingsByStatus().get("CANCELLED"));
        assertEquals(10, response.getBookingsByStatus().get("COMPLETED"));
    }

    @Test
    @DisplayName("Monitor flights with large numbers")
    void testMonitorFlightTransactions_LargeNumbers() {
        // Arrange
        long airlineId = 0L;

        List<Object[]> ticketStats = new ArrayList<>();
        ticketStats.add(new Object[]{1000000L, 500000000.0});  // 1 million tickets, 500 million revenue
        when(flightTicketRepository.getTotalTicketsCountBetweenDate(startDate, endDate))
            .thenReturn(ticketStats);

        when(flightTicketRepository.getTicketCountsByPaymentStatusBetweenDate(startDate, endDate))
            .thenReturn(new ArrayList<>());
        when(flightTicketRepository.getTicketCountsAndRevenueByAirlineBetweenDate(startDate, endDate))
            .thenReturn(new ArrayList<>());
        when(flightTicketRepository.getFlightCountsByStatusBetweenDate(startDate, endDate))
            .thenReturn(new ArrayList<>());
        when(ticketPaymentRepository.getPaymentCountsByStatusBetweenDate(startDate, endDate))
            .thenReturn(new ArrayList<>());
        when(ticketPaymentRepository.getTicketPaymentCountsAndRevenueByMethodBetweenDate(startDate, endDate))
            .thenReturn(new ArrayList<>());
        when(flightTicketRepository.getDailyTicketSalesSummary(startDate, endDate))
            .thenReturn(new ArrayList<>());

        // Act
        FlightMonitoringResponse response = adminService.monitorFlightTransactions(startDate, endDate, airlineId);

        // Assert
        assertNotNull(response);
        assertEquals(1000000, response.getTotalTickets());
        assertEquals(500000000.0, response.getTotalRevenue());
    }

    @Test
    @DisplayName("Monitor bookings with same start and end date")
    void testMonitorBookings_SameDayRange() {
        // Arrange
        LocalDate sameDate = LocalDate.of(2024, 1, 15);
        long hotelId = 0L;

        List<Object[]> bookingStats = new ArrayList<>();
        bookingStats.add(new Object[]{10L, 5000.0, 20L, 15L});
        when(bookingTransactionRepository.getTotalBookingsCountBetweenDate(sameDate, sameDate))
            .thenReturn(bookingStats);

        when(bookingTransactionRepository.getBookingCountsByStatusBetweenDate(sameDate, sameDate))
            .thenReturn(new ArrayList<>());
        when(bookingTransactionRepository.getBookingCountsAndRevenueByHotelBetweenDate(sameDate, sameDate))
            .thenReturn(new ArrayList<>());
        when(bookingTransactionRepository.getDailyBookingSummary(sameDate, sameDate))
            .thenReturn(new ArrayList<>());
        when(bookingTransactionRepository.getBookingCountsAndRevenueByPaymentMethod(sameDate, sameDate))
            .thenReturn(new ArrayList<>());
        when(bookingTransactionRepository.getBookingCountsByPaymentStatusBetweenDate(sameDate, sameDate))
            .thenReturn(new ArrayList<>());

        // Act
        BookingMonitoringResponse response = adminService.monitorBookings(sameDate, sameDate, hotelId);

        // Assert
        assertNotNull(response);
        assertEquals(10, response.getTotalBookings());

        verify(bookingTransactionRepository).getTotalBookingsCountBetweenDate(sameDate, sameDate);
    }
}

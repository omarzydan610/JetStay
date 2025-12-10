package com.example.backend.service.AdminService;

import com.example.backend.dto.AdminDTO.BookingMonitoringResponse;
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

@DisplayName("Admin Service - Booking Monitoring Tests")
class AdminServiceBookingTest {

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
        assertEquals(0, response.getTotalBookings());
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
        bookingStats.add(new Object[]{10L, null, null, null});
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
        assertEquals(0.0, response.getTotalRevenue());
        assertEquals(0.0, response.getTotalGuests());
        assertEquals(0.0, response.getTotalRoomsBooked());
    }

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

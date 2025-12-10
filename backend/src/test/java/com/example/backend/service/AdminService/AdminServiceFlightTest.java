package com.example.backend.service.AdminService;

import com.example.backend.dto.AdminDTO.FlightMonitoringResponse;
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

@DisplayName("Admin Service - Flight Monitoring Tests")
class AdminServiceFlightTest {

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
    private AdminMonitorFlight adminService;

    private LocalDate startDate;
    private LocalDate endDate;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        startDate = LocalDate.of(2024, 1, 1);
        endDate = LocalDate.of(2024, 1, 31);
    }

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

    @Test
    @DisplayName("Monitor flights with large numbers")
    void testMonitorFlightTransactions_LargeNumbers() {
        // Arrange
        long airlineId = 0L;

        List<Object[]> ticketStats = new ArrayList<>();
        ticketStats.add(new Object[]{1000000L, 500000000.0});
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
}

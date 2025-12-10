package com.example.backend.service.AdminService;

import com.example.backend.dto.AdminDTO.PartnerShipNameResponse;
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

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@DisplayName("Admin Service - Partnership Tests")
class AdminServicePartnershipTest {

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

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

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
}

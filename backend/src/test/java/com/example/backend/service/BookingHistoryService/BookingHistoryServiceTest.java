package com.example.backend.service.BookingHistoryService;

import com.example.backend.dto.BookingDTOs.FlightTicketResponse;
import com.example.backend.dto.BookingDTOs.HotelBookingResponse;
import com.example.backend.entity.*;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.BookingTransactionRepository;
import com.example.backend.repository.FlightTicketRepository;
import com.example.backend.repository.RoomBookingRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.*;

@DisplayName("BookingHistoryService Unit Tests")
class BookingHistoryServiceTest {

  @Mock
  private RoomBookingRepository roomBookingRepository;

  @Mock
  private FlightTicketRepository flightTicketRepository;

  @Mock
  private BookingTransactionRepository bookingTransactionRepository;

  @InjectMocks
  private BookingHistoryService bookingHistoryService;

  private User testUser;
  private Hotel testHotel;
  private RoomType testRoomType;
  private RoomBooking testRoomBooking;
  private BookingTransaction testBookingTransaction;
  private FlightTicket testFlightTicket;
  private Flight testFlight;
  private Airline testAirline;

  @BeforeEach
  void setUp() {
    MockitoAnnotations.openMocks(this);
    initializeTestData();
  }

  private void initializeTestData() {
    // Initialize User
    testUser = new User();
    testUser.setUserID(1);
    testUser.setFirstName("John");
    testUser.setLastName("Doe");
    testUser.setEmail("john@example.com");

    // Initialize Hotel
    testHotel = new Hotel();
    testHotel.setHotelID(1);
    testHotel.setHotelName("Grand Plaza Hotel");
    testHotel.setCity("New York");
    testHotel.setCountry("USA");

    // Initialize RoomType
    testRoomType = new RoomType();
    testRoomType.setRoomTypeID(1);
    testRoomType.setRoomTypeName("Deluxe Suite");
    testRoomType.setPrice(150.0f);
    testRoomType.setNumberOfGuests(2);
    testRoomType.setQuantity(10);
    testRoomType.setHotel(testHotel);

    // Initialize BookingTransaction
    testBookingTransaction = new BookingTransaction();
    testBookingTransaction.setBookingTransactionId(1);
    testBookingTransaction.setUser(testUser);
    testBookingTransaction.setHotel(testHotel);
    testBookingTransaction.setStatus(BookingTransaction.Status.CONFIRMED);
    testBookingTransaction.setBookingDate(LocalDate.now().minusDays(5));
    testBookingTransaction.setTotalPrice(600.0f);
    testBookingTransaction.setCheckIn(LocalDate.of(2025, 12, 28));
    testBookingTransaction.setCheckOut(LocalDate.of(2026, 1, 2));
    testBookingTransaction.setNumberOfGuests(2);
    testBookingTransaction.setNumberOfRooms(1);
    testBookingTransaction.setIsPaid(true);

    // Initialize RoomBooking
    testRoomBooking = new RoomBooking();
    testRoomBooking.setBookingId(1);
    testRoomBooking.setUser(testUser);
    testRoomBooking.setHotel(testHotel);
    testRoomBooking.setRoomType(testRoomType);
    testRoomBooking.setCheckIn(LocalDate.of(2025, 12, 28));
    testRoomBooking.setCheckOut(LocalDate.of(2026, 1, 2));
    testRoomBooking.setNoOfRooms(1);
    testRoomBooking.setBookingTransaction(testBookingTransaction);

    // Initialize Airline
    testAirline = new Airline();
    testAirline.setAirlineID(1);
    testAirline.setAirlineName("American Airlines");
    testAirline.setAirlineNationality("USA");

    // Initialize Flight
    testFlight = new Flight();
    testFlight.setFlightID(1);
    testFlight.setAirline(testAirline);
    testFlight.setDepartureDate(LocalDateTime.of(2025, 12, 26, 8, 30));
    testFlight.setArrivalDate(LocalDateTime.of(2025, 12, 26, 11, 45));

    // Initialize departure and arrival airports
    Airport departureAirport = new Airport();
    departureAirport.setAirportID(1);
    departureAirport.setAirportName("JFK");
    departureAirport.setCity("New York");
    testFlight.setDepartureAirport(departureAirport);

    Airport arrivalAirport = new Airport();
    arrivalAirport.setAirportID(2);
    arrivalAirport.setAirportName("LAX");
    arrivalAirport.setCity("Los Angeles");
    testFlight.setArrivalAirport(arrivalAirport);

    // Initialize FlightTicket
    testFlightTicket = new FlightTicket();
    testFlightTicket.setTicketId(1);
    testFlightTicket.setUser(testUser);
    testFlightTicket.setFlight(testFlight);
    testFlightTicket.setAirline(testAirline);

    TripType tripType = new TripType();
    tripType.setTypeName("Economy");
    tripType.setPrice(350.0f);
    testFlightTicket.setTripType(tripType);

    testFlightTicket.setIsPaid(true);
    testFlightTicket.setCreatedAt(LocalDate.of(2025, 12, 15));
    testFlightTicket.setFlightDate(LocalDate.of(2025, 12, 26));
    testFlightTicket.setPrice(350.0f);
    testFlightTicket.setState(FlightTicket.TicketState.COMPLETED);
  }

  @Test
  @DisplayName("Should return hotel booking history for a user")
  void testGetBookingHistory() {
    // Arrange
    List<BookingTransaction> transactions = new ArrayList<>();
    transactions.add(testBookingTransaction);

    List<RoomBooking> roomBookings = new ArrayList<>();
    roomBookings.add(testRoomBooking);

    when(bookingTransactionRepository.findPastBookingsByUserId(1))
        .thenReturn(transactions);
    when(roomBookingRepository.findByBookingTransactionId(1))
        .thenReturn(roomBookings);

    // Act
    List<HotelBookingResponse> result = bookingHistoryService.getBookingHistory(1);

    // Assert
    assertNotNull(result);
    assertEquals(1, result.size());
    verify(bookingTransactionRepository, times(1)).findPastBookingsByUserId(1);
    verify(roomBookingRepository, times(1)).findByBookingTransactionId(1);
  }

  @Test
  @DisplayName("Should return empty list when user has no hotel bookings")
  void testGetBookingHistoryEmpty() {
    // Arrange
    when(bookingTransactionRepository.findPastBookingsByUserId(1))
        .thenReturn(new ArrayList<>());

    // Act
    List<HotelBookingResponse> result = bookingHistoryService.getBookingHistory(1);

    // Assert
    assertNotNull(result);
    assertEquals(0, result.size());
    assertTrue(result.isEmpty());
  }

  @Test
  @DisplayName("Should return upcoming hotel bookings")
  void testGetUpcomingBookings() {
    // Arrange
    List<BookingTransaction> transactions = new ArrayList<>();
    transactions.add(testBookingTransaction);

    List<RoomBooking> roomBookings = new ArrayList<>();
    roomBookings.add(testRoomBooking);

    when(bookingTransactionRepository.findUpcomingBookingsByUserId(1))
        .thenReturn(transactions);
    when(roomBookingRepository.findByBookingTransactionId(1))
        .thenReturn(roomBookings);

    // Act
    List<HotelBookingResponse> result = bookingHistoryService.getUpcomingBookings(1);

    // Assert
    assertNotNull(result);
    assertEquals(1, result.size());
    verify(bookingTransactionRepository, times(1)).findUpcomingBookingsByUserId(1);
    verify(roomBookingRepository, times(1)).findByBookingTransactionId(1);
  }

  @Test
  @DisplayName("Should return empty list when user has no upcoming hotel bookings")
  void testGetUpcomingBookingsEmpty() {
    // Arrange
    when(bookingTransactionRepository.findUpcomingBookingsByUserId(1))
        .thenReturn(new ArrayList<>());

    // Act
    List<HotelBookingResponse> result = bookingHistoryService.getUpcomingBookings(1);

    // Assert
    assertNotNull(result);
    assertEquals(0, result.size());
    assertTrue(result.isEmpty());
  }

  @Test
  @DisplayName("Should return hotel booking details by transaction ID")
  void testGetBookingDetails() {
    // Arrange
    List<RoomBooking> roomBookings = new ArrayList<>();
    roomBookings.add(testRoomBooking);

    when(bookingTransactionRepository.findById(1))
        .thenReturn(Optional.of(testBookingTransaction));
    when(roomBookingRepository.findByBookingTransactionId(1))
        .thenReturn(roomBookings);

    // Act
    HotelBookingResponse result = bookingHistoryService.getBookingDetails(1);

    // Assert
    assertNotNull(result);
    assertNotNull(result.getBookingTransaction());
    assertEquals(1, result.getBookingTransaction().getBookingTransactionId());
    verify(bookingTransactionRepository, times(1)).findById(1);
    verify(roomBookingRepository, times(1)).findByBookingTransactionId(1);
  }

  @Test
  @DisplayName("Should throw ResourceNotFoundException when booking transaction not found")
  void testGetBookingDetailsNotFound() {
    // Arrange
    when(bookingTransactionRepository.findById(999))
        .thenReturn(Optional.empty());

    // Act & Assert
    ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class, () -> {
      bookingHistoryService.getBookingDetails(999);
    });
    assertTrue(exception.getMessage().contains("Booking transaction not found"));
    verify(bookingTransactionRepository, times(1)).findById(999);
  }

  @Test
  @DisplayName("Should return flight ticket history for a user")
  void testGetFlightTicketHistory() {
    // Arrange
    List<FlightTicket> tickets = new ArrayList<>();
    tickets.add(testFlightTicket);

    when(flightTicketRepository.findPastFlightsByUserId(1))
        .thenReturn(tickets);

    // Act
    List<FlightTicketResponse> result = bookingHistoryService.getFlightTicketHistory(1);

    // Assert
    assertNotNull(result);
    assertEquals(1, result.size());
    assertEquals(testFlightTicket.getTicketId(), result.get(0).getTicketId());
    verify(flightTicketRepository, times(1)).findPastFlightsByUserId(1);
  }

  @Test
  @DisplayName("Should return upcoming flight tickets")
  void testGetUpcomingFlightTickets() {
    // Arrange
    List<FlightTicket> tickets = new ArrayList<>();
    tickets.add(testFlightTicket);

    when(flightTicketRepository.findUpcomingFlightsByUserId(1))
        .thenReturn(tickets);

    // Act
    List<FlightTicketResponse> result = bookingHistoryService.getUpcomingFlightTickets(1);

    // Assert
    assertNotNull(result);
    assertEquals(1, result.size());
    assertEquals(testFlightTicket.getTicketId(), result.get(0).getTicketId());
    verify(flightTicketRepository, times(1)).findUpcomingFlightsByUserId(1);
  }

  @Test
  @DisplayName("Should return flight ticket details by ticket ID")
  void testGetFlightTicketDetails() {
    // Arrange
    when(flightTicketRepository.findById(1))
        .thenReturn(Optional.of(testFlightTicket));

    // Act
    FlightTicketResponse result = bookingHistoryService.getFlightTicketDetails(1);

    // Assert
    assertNotNull(result);
    assertEquals(testFlightTicket.getTicketId(), result.getTicketId());
    assertEquals(testFlightTicket.getPrice(), result.getPrice());
    verify(flightTicketRepository, times(1)).findById(1);
  }

  @Test
  @DisplayName("Should throw ResourceNotFoundException when flight ticket not found")
  void testGetFlightTicketDetailsNotFound() {
    // Arrange
    when(flightTicketRepository.findById(999))
        .thenReturn(Optional.empty());

    // Act & Assert
    ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class, () -> {
      bookingHistoryService.getFlightTicketDetails(999);
    });
    assertTrue(exception.getMessage().contains("Flight ticket not found"));
    verify(flightTicketRepository, times(1)).findById(999);
  }

  @Test
  @DisplayName("Should handle multiple hotel bookings correctly")
  void testGetBookingHistoryMultipleTransactions() {
    // Arrange
    BookingTransaction transaction2 = new BookingTransaction();
    transaction2.setBookingTransactionId(2);
    transaction2.setUser(testUser);
    transaction2.setHotel(testHotel);
    transaction2.setStatus(BookingTransaction.Status.CONFIRMED);
    transaction2.setBookingDate(LocalDate.now().minusDays(10));
    transaction2.setTotalPrice(500.0f);
    transaction2.setCheckIn(LocalDate.of(2025, 11, 15));
    transaction2.setCheckOut(LocalDate.of(2025, 11, 20));

    RoomBooking roomBooking2 = new RoomBooking();
    roomBooking2.setBookingId(2);
    roomBooking2.setUser(testUser);
    roomBooking2.setHotel(testHotel);
    roomBooking2.setRoomType(testRoomType);
    roomBooking2.setNoOfRooms(1);
    roomBooking2.setBookingTransaction(transaction2);

    List<BookingTransaction> transactions = new ArrayList<>();
    transactions.add(testBookingTransaction);
    transactions.add(transaction2);

    when(bookingTransactionRepository.findPastBookingsByUserId(1))
        .thenReturn(transactions);
    when(roomBookingRepository.findByBookingTransactionId(1))
        .thenReturn(List.of(testRoomBooking));
    when(roomBookingRepository.findByBookingTransactionId(2))
        .thenReturn(List.of(roomBooking2));

    // Act
    List<HotelBookingResponse> result = bookingHistoryService.getBookingHistory(1);

    // Assert
    assertNotNull(result);
    assertEquals(2, result.size());
  }

  @Test
  @DisplayName("Should return empty list for flight history when no tickets exist")
  void testGetFlightTicketHistoryEmpty() {
    // Arrange
    when(flightTicketRepository.findPastFlightsByUserId(1))
        .thenReturn(new ArrayList<>());

    // Act
    List<FlightTicketResponse> result = bookingHistoryService.getFlightTicketHistory(1);

    // Assert
    assertNotNull(result);
    assertTrue(result.isEmpty());
  }

  @Test
  @DisplayName("Should correctly map hotel booking response structure")
  void testHotelBookingResponseStructure() {
    // Arrange
    List<RoomBooking> roomBookings = new ArrayList<>();
    roomBookings.add(testRoomBooking);

    when(bookingTransactionRepository.findById(1))
        .thenReturn(Optional.of(testBookingTransaction));
    when(roomBookingRepository.findByBookingTransactionId(1))
        .thenReturn(roomBookings);

    // Act
    HotelBookingResponse result = bookingHistoryService.getBookingDetails(1);

    // Assert
    assertNotNull(result);
    assertNotNull(result.getBookingTransaction());
    assertNotNull(result.getRoomBooking());
    assertEquals(1, result.getRoomBooking().size());
    assertEquals("Deluxe Suite", result.getRoomBooking().get(0).getRoomType());
  }
}

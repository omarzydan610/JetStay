package com.example.backend.service.BookingHistoryService;

import com.example.backend.dto.BookingDTO.BookingResponse;
import com.example.backend.entity.*;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.mapper.BookingHistoryMapper;
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

  @InjectMocks
  private BookingHistoryService bookingHistoryService;

  private User testUser;
  private Hotel testHotel;
  private RoomType testRoomType;
  private RoomBooking testRoomBooking;
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
    testRoomType.setQuantity(10);
    testRoomType.setHotel(testHotel);

    // Initialize RoomBooking
    testRoomBooking = new RoomBooking();
    testRoomBooking.setBookingId(1);
    testRoomBooking.setUser(testUser);
    testRoomBooking.setHotel(testHotel);
    testRoomBooking.setRoomType(testRoomType);
    testRoomBooking.setCheckIn(LocalDate.of(2025, 12, 28));
    testRoomBooking.setCheckOut(LocalDate.of(2026, 01, 2));
    testRoomBooking.setNoOfRooms(2);
    // Initialize BookingTransaction
    BookingTransaction bookingTransaction = new BookingTransaction();
    bookingTransaction.setBookingTransactionId(1);
    bookingTransaction.setStatus(BookingTransaction.Status.COMPLETED);
    bookingTransaction.setBookingDate(LocalDate.now().minusDays(5));
    bookingTransaction.setTotalPrice(600.0f);
    testRoomBooking.setBookingTransaction(bookingTransaction);

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
    testFlightTicket.setUser(testUser);
    testFlightTicket.setFlight(testFlight);
    testFlightTicket.setAirline(testAirline);
    testFlightTicket.setTripType(new TripType());
    testFlightTicket.getTripType().setTypeName("Economy");
    testFlightTicket.getTripType().setPrice(350);
    testFlightTicket.setIsPaid(true);
    testFlightTicket.setCreatedAt(LocalDate.of(2025, 12, 15));
    testFlightTicket.setFlightDate(LocalDate.of(2025, 12, 26));
  }

  @Test
  @DisplayName("Should return all booking history for a user")
  void testGetBookingHistory() {
    // Arrange
    List<RoomBooking> hotelBookings = new ArrayList<>();
    hotelBookings.add(testRoomBooking);
    List<FlightTicket> flightBookings = new ArrayList<>();
    flightBookings.add(testFlightTicket);

    when(roomBookingRepository.findPastBookingsByUserId(1))
        .thenReturn(hotelBookings);
    when(flightTicketRepository.findPastFlightsByUserId(1))
        .thenReturn(flightBookings);

    // Act
    List<BookingResponse> result = bookingHistoryService.getBookingHistory(1);

    // Assert
    assertNotNull(result);
    assertEquals(2, result.size());
    verify(roomBookingRepository, times(1)).findPastBookingsByUserId(1);
    verify(flightTicketRepository, times(1)).findPastFlightsByUserId(1);
  }

  @Test
  @DisplayName("Should return only hotel bookings when user has no flights")
  void testGetBookingHistoryOnlyHotels() {
    // Arrange
    List<RoomBooking> hotelBookings = new ArrayList<>();
    hotelBookings.add(testRoomBooking);

    when(roomBookingRepository.findPastBookingsByUserId(1))
        .thenReturn(hotelBookings);
    when(flightTicketRepository.findPastFlightsByUserId(1))
        .thenReturn(new ArrayList<>());

    // Act
    List<BookingResponse> result = bookingHistoryService.getBookingHistory(1);

    // Assert
    assertNotNull(result);
    assertEquals(1, result.size());
    verify(roomBookingRepository, times(1)).findPastBookingsByUserId(1);
    verify(flightTicketRepository, times(1)).findPastFlightsByUserId(1);
  }

  @Test
  @DisplayName("Should return only flight bookings when user has no hotels")
  void testGetBookingHistoryOnlyFlights() {
    // Arrange
    List<FlightTicket> flightBookings = new ArrayList<>();
    flightBookings.add(testFlightTicket);

    when(roomBookingRepository.findPastBookingsByUserId(1))
        .thenReturn(new ArrayList<>());
    when(flightTicketRepository.findPastFlightsByUserId(1))
        .thenReturn(flightBookings);

    // Act
    List<BookingResponse> result = bookingHistoryService.getBookingHistory(1);

    // Assert
    assertNotNull(result);
    assertEquals(1, result.size());
    verify(roomBookingRepository, times(1)).findPastBookingsByUserId(1);
    verify(flightTicketRepository, times(1)).findPastFlightsByUserId(1);
  }

  @Test
  @DisplayName("Should return empty list when user has no bookings")
  void testGetBookingHistoryEmptyHistory() {
    // Arrange
    when(roomBookingRepository.findPastBookingsByUserId(1))
        .thenReturn(new ArrayList<>());
    when(flightTicketRepository.findPastFlightsByUserId(1))
        .thenReturn(new ArrayList<>());

    // Act
    List<BookingResponse> result = bookingHistoryService.getBookingHistory(1);

    // Assert
    assertNotNull(result);
    assertEquals(0, result.size());
    assertTrue(result.isEmpty());
  }

  @Test
  @DisplayName("Should return upcoming hotel and flight bookings")
  void testGetUpcomingBookings() {
    // Arrange
    List<RoomBooking> upcomingHotels = new ArrayList<>();
    upcomingHotels.add(testRoomBooking);
    List<FlightTicket> upcomingFlights = new ArrayList<>();
    upcomingFlights.add(testFlightTicket);

    when(roomBookingRepository.findUpcomingBookingsByUserId(1))
        .thenReturn(upcomingHotels);
    when(flightTicketRepository.findUpcomingFlightsByUserId(1))
        .thenReturn(upcomingFlights);

    // Act
    List<BookingResponse> result = bookingHistoryService.getUpcomingBookings(1);

    // Assert
    assertNotNull(result);
    assertEquals(2, result.size());
    verify(roomBookingRepository, times(1)).findUpcomingBookingsByUserId(1);
    verify(flightTicketRepository, times(1)).findUpcomingFlightsByUserId(1);
  }

  @Test
  @DisplayName("Should return only upcoming hotel bookings")
  void testGetUpcomingBookingsOnlyHotels() {
    // Arrange
    List<RoomBooking> upcomingHotels = new ArrayList<>();
    upcomingHotels.add(testRoomBooking);

    when(roomBookingRepository.findUpcomingBookingsByUserId(1))
        .thenReturn(upcomingHotels);
    when(flightTicketRepository.findUpcomingFlightsByUserId(1))
        .thenReturn(new ArrayList<>());

    // Act
    List<BookingResponse> result = bookingHistoryService.getUpcomingBookings(1);

    // Assert
    assertNotNull(result);
    assertEquals(1, result.size());
  }

  @Test
  @DisplayName("Should return only upcoming flight bookings")
  void testGetUpcomingBookingsOnlyFlights() {
    // Arrange
    List<FlightTicket> upcomingFlights = new ArrayList<>();
    upcomingFlights.add(testFlightTicket);

    when(roomBookingRepository.findUpcomingBookingsByUserId(1))
        .thenReturn(new ArrayList<>());
    when(flightTicketRepository.findUpcomingFlightsByUserId(1))
        .thenReturn(upcomingFlights);

    // Act
    List<BookingResponse> result = bookingHistoryService.getUpcomingBookings(1);

    // Assert
    assertNotNull(result);
    assertEquals(1, result.size());
  }

  @Test
  @DisplayName("Should return empty list when user has no upcoming bookings")
  void testGetUpcomingBookingsEmpty() {
    // Arrange
    when(roomBookingRepository.findUpcomingBookingsByUserId(1))
        .thenReturn(new ArrayList<>());
    when(flightTicketRepository.findUpcomingFlightsByUserId(1))
        .thenReturn(new ArrayList<>());

    // Act
    List<BookingResponse> result = bookingHistoryService.getUpcomingBookings(1);

    // Assert
    assertNotNull(result);
    assertEquals(0, result.size());
    assertTrue(result.isEmpty());
  }

  @Test
  @DisplayName("Should return hotel booking details by ID")
  void testGetBookingDetailsHotel() {
    // Arrange
    when(roomBookingRepository.findById(1))
        .thenReturn(Optional.of(testRoomBooking));

    // Act
    BookingResponse result = bookingHistoryService.getBookingDetails(1);

    // Assert
    assertNotNull(result);
    assertEquals("HOTEL", result.getType());
    verify(roomBookingRepository, times(1)).findById(1);
  }

  @Test
  @DisplayName("Should return flight booking details by ID")
  void testGetBookingDetailsFlight() {
    // Arrange
    when(roomBookingRepository.findById(2))
        .thenReturn(Optional.empty());
    when(flightTicketRepository.findById(2))
        .thenReturn(Optional.of(testFlightTicket));

    // Act
    BookingResponse result = bookingHistoryService.getBookingDetails(2);

    // Assert
    assertNotNull(result);
    assertEquals("FLIGHT", result.getType());
    verify(roomBookingRepository, times(1)).findById(2);
    verify(flightTicketRepository, times(1)).findById(2);
  }

  @Test
  @DisplayName("Should throw ResourceNotFoundException when booking not found")
  void testGetBookingDetailsNotFound() {
    // Arrange
    when(roomBookingRepository.findById(999))
        .thenReturn(Optional.empty());
    when(flightTicketRepository.findById(999))
        .thenReturn(Optional.empty());

    // Act & Assert
    ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class, () -> {
      bookingHistoryService.getBookingDetails(999);
    });
    assertEquals("Booking not found", exception.getMessage());
    verify(roomBookingRepository, times(1)).findById(999);
    verify(flightTicketRepository, times(1)).findById(999);
  }

  @Test
  @DisplayName("Should try flight booking when hotel booking not found")
  void testGetBookingDetailsTriesFlightWhenHotelNotFound() {
    // Arrange
    when(roomBookingRepository.findById(100))
        .thenReturn(Optional.empty());
    when(flightTicketRepository.findById(100))
        .thenReturn(Optional.of(testFlightTicket));

    // Act
    BookingResponse result = bookingHistoryService.getBookingDetails(100);

    // Assert
    assertNotNull(result);
    assertEquals("FLIGHT", result.getType());
    verify(roomBookingRepository, times(1)).findById(100);
    verify(flightTicketRepository, times(1)).findById(100);
  }

  @Test
  @DisplayName("Should handle multiple bookings in history correctly")
  void testGetBookingHistoryMultipleBookings() {
    // Arrange
    RoomBooking roomBooking2 = new RoomBooking();
    roomBooking2.setUser(testUser);
    roomBooking2.setHotel(testHotel);
    roomBooking2.setRoomType(testRoomType);
    roomBooking2.setCheckIn(LocalDate.of(2025, 11, 15));
    roomBooking2.setCheckOut(LocalDate.of(2025, 11, 20));
    // Add BookingTransaction for roomBooking2
    BookingTransaction bookingTransaction2 = new BookingTransaction();
    bookingTransaction2.setBookingTransactionId(2);
    bookingTransaction2.setStatus(BookingTransaction.Status.COMPLETED);
    bookingTransaction2.setBookingDate(LocalDate.now().minusDays(10));
    bookingTransaction2.setTotalPrice(500.0f);
    roomBooking2.setBookingTransaction(bookingTransaction2);

    FlightTicket flightTicket2 = new FlightTicket();
    flightTicket2.setUser(testUser);
    flightTicket2.setFlight(testFlight);
    flightTicket2.setAirline(testAirline);
    flightTicket2.setTripType(testFlightTicket.getTripType());
    flightTicket2.setIsPaid(true);
    flightTicket2.setCreatedAt(LocalDate.of(2025, 11, 10));
    flightTicket2.setFlightDate(LocalDate.of(2025, 11, 20));

    List<RoomBooking> hotelBookings = new ArrayList<>();
    hotelBookings.add(testRoomBooking);
    hotelBookings.add(roomBooking2);

    List<FlightTicket> flightBookings = new ArrayList<>();
    flightBookings.add(testFlightTicket);
    flightBookings.add(flightTicket2);

    when(roomBookingRepository.findPastBookingsByUserId(1))
        .thenReturn(hotelBookings);
    when(flightTicketRepository.findPastFlightsByUserId(1))
        .thenReturn(flightBookings);

    // Act
    List<BookingResponse> result = bookingHistoryService.getBookingHistory(1);

    // Assert
    assertNotNull(result);
    assertEquals(4, result.size());
    long hotelCount = result.stream()
        .filter(b -> "HOTEL".equals(b.getType()))
        .count();
    long flightCount = result.stream()
        .filter(b -> "FLIGHT".equals(b.getType()))
        .count();
    assertEquals(2, hotelCount);
    assertEquals(2, flightCount);
  }

  @Test
  @DisplayName("Should correctly parse hotel booking response structure")
  void testGetBookingDetailsHotelResponseStructure() {
    // Arrange
    when(roomBookingRepository.findById(1))
        .thenReturn(Optional.of(testRoomBooking));

    // Act
    BookingResponse result = bookingHistoryService.getBookingDetails(1);

    // Assert
    assertNotNull(result);
    assertEquals("HOTEL", result.getType());
    assertNotNull(result.getHotelBooking());
    assertNull(result.getFlightBooking());
  }

  @Test
  @DisplayName("Should correctly parse flight booking response structure")
  void testGetBookingDetailsFlightResponseStructure() {
    // Arrange
    when(roomBookingRepository.findById(2))
        .thenReturn(Optional.empty());
    when(flightTicketRepository.findById(2))
        .thenReturn(Optional.of(testFlightTicket));

    // Act
    BookingResponse result = bookingHistoryService.getBookingDetails(2);

    // Assert
    assertNotNull(result);
    assertEquals("FLIGHT", result.getType());
    assertNull(result.getHotelBooking());
    assertNotNull(result.getFlightBooking());
  }
}

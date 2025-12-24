package com.example.backend.service.BookingService;

import com.example.backend.dto.BookingDTOs.TicketBookingRequest;
import com.example.backend.entity.*;
import com.example.backend.exception.BadRequestException;
import com.example.backend.repository.*;
import com.example.backend.service.AuthService.JwtAuthService;

import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityManager;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.CyclicBarrier;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class TicketBookingServiceTest {

    @Autowired
    private TicketBookingService ticketBookingService;

    @Autowired
    private FlightTicketRepository flightTicketRepository;

    @Autowired
    private FlightRepository flightRepository;

    @Autowired
    private TripTypeRepository tripTypeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AirlineRepository airlineRepository;

    @Autowired
    private AirportRepository airportRepository;

    @Autowired
    private FlightReviewRepository flightReviewRepository;

    @Autowired
    private TicketPaymentRepository ticketPaymentRepository;

    @Autowired
    private FlightOfferRepository flightOfferRepository;

    @Autowired
    private BookingTransactionRepository bookingTransactionRepository;

    @Autowired
    private RoomBookingRepository roomBookingRepository;

    @Autowired
    private HotelReviewRepository hotelReviewRepository;

    @Autowired
    private EntityManager entityManager;

    @MockBean
    private JwtAuthService jwtAuthService;

    private User testUser;
    private User airlineAdmin;
    private Airline airline;
    private Airport departureAirport;
    private Airport arrivalAirport;
    private Flight flight;
    private TripType tripType;

    @BeforeEach
    void setup() {
        // Clean up repositories in correct order to respect foreign key constraints
        // 1. Delete entities that reference FlightTicket
        flightReviewRepository.deleteAll();
        ticketPaymentRepository.deleteAll();
        
        // 2. Delete FlightTicket (references FlightOffer, Flight, Airline, TripType, User)
        flightTicketRepository.deleteAll();
        
        // 3. Delete FlightOffer (references Flight, Airline)
        flightOfferRepository.deleteAll();
        
        // 4. Delete TripType (references Flight)
        tripTypeRepository.deleteAll();
        
        // 5. Delete Flight (references Airline, Airport)
        flightRepository.deleteAll();
        
        // 6. Delete Airline (references User)
        airlineRepository.deleteAll();
        
        // 7. Delete Airport (no dependencies)
        airportRepository.deleteAll();
        
        // 8. Delete hotel-related entities that reference User/BookingTransaction
        // (needed because other tests might have created these)
        roomBookingRepository.deleteAll();
        hotelReviewRepository.deleteAll();
        bookingTransactionRepository.deleteAll();
        
        // 9. Delete User (no dependencies, but must be deleted after BookingTransaction)
        userRepository.deleteAll();
        
        // Flush and clear entity manager to ensure all deletions are committed
        // and to clear any stale references from the Hibernate session
        // Only do this if we're in a transaction (concurrency tests suspend transactions)
        try {
            entityManager.flush();
            entityManager.clear();
        } catch (jakarta.persistence.TransactionRequiredException e) {
            // If no transaction is active (e.g., in concurrency tests), skip flush/clear
            // The deletions will still be effective when the transaction starts
        }

        // Generate unique identifiers for this test run to avoid conflicts with other tests
        String uniqueId = UUID.randomUUID().toString().substring(0, 8);

        // Create test user
        testUser = new User();
        testUser.setEmail("ticketuser_" + uniqueId + "@test.com");
        testUser.setPassword("password");
        testUser.setFirstName("Test");
        testUser.setLastName("User");
        testUser.setPhoneNumber("01" + uniqueId.replace("-", "").substring(0, 8));
        testUser.setStatus(User.UserStatus.ACTIVE);
        testUser.setRole(User.UserRole.CLIENT);
        testUser = userRepository.save(testUser);

        // Create airline admin
        airlineAdmin = new User();
        airlineAdmin.setEmail("ticketadmin_" + uniqueId + "@test.com");
        airlineAdmin.setPassword("password");
        airlineAdmin.setFirstName("Airline");
        airlineAdmin.setLastName("Admin");
        airlineAdmin.setPhoneNumber("02" + uniqueId.replace("-", "").substring(0, 8));
        airlineAdmin.setStatus(User.UserStatus.ACTIVE);
        airlineAdmin.setRole(User.UserRole.AIRLINE_ADMIN);
        airlineAdmin = userRepository.save(airlineAdmin);

        // Create airline
        airline = new Airline();
        airline.setAirlineName("Test Airline");
        airline.setAirlineNationality("Egypt");
        airline.setAirlineRate(4.5f);
        airline.setLogoUrl("test-logo.png");
        airline.setAdmin(airlineAdmin);
        airline.setCreatedAt(LocalDateTime.now());
        airline.setStatus(Airline.Status.ACTIVE);
        airline = airlineRepository.save(airline);

        // Create airports
        departureAirport = new Airport();
        departureAirport.setAirportName("Cairo International");
        departureAirport.setCity("Cairo");
        departureAirport.setCountry("Egypt");
        departureAirport = airportRepository.save(departureAirport);

        arrivalAirport = new Airport();
        arrivalAirport.setAirportName("Dubai International");
        arrivalAirport.setCity("Dubai");
        arrivalAirport.setCountry("UAE");
        arrivalAirport = airportRepository.save(arrivalAirport);

        // Create flight
        flight = new Flight();
        flight.setAirline(airline);
        flight.setDepartureAirport(departureAirport);
        flight.setArrivalAirport(arrivalAirport);
        flight.setDepartureDate(LocalDateTime.now().plusDays(1));
        flight.setArrivalDate(LocalDateTime.now().plusDays(1).plusHours(3));
        flight.setStatus(Flight.FlightStatus.ON_TIME);
        flight.setDescription("Test Flight");
        flight.setPlaneType("Boeing 777");
        flight = flightRepository.save(flight);

        // Create trip type
        tripType = new TripType();
        tripType.setFlight(flight);
        tripType.setQuantity(10);
        tripType.setPrice(500.0f);
        tripType.setTypeName("ECONOMY");
        tripType = tripTypeRepository.save(tripType);
    }

    @Test
    @Order(1)
    void testTicketBookingService_Success_SingleTicket() {
        // Arrange
        TicketBookingRequest request = new TicketBookingRequest();
        request.setFlightId(flight.getFlightID());
        request.setTripTypeId(tripType.getTypeID());
        request.setQuantity(1);

        // Act
        Integer[] ticketIds = assertDoesNotThrow(() -> 
            ticketBookingService.ticketBookingService(request, testUser.getUserID()));

        // Assert
        assertNotNull(ticketIds);
        assertEquals(1, ticketIds.length);
        assertNotNull(ticketIds[0]);

        List<FlightTicket> tickets = flightTicketRepository.findAll();
        assertEquals(1, tickets.size());
        assertEquals(testUser.getUserID(), tickets.get(0).getUser().getUserID());
        assertEquals(tripType.getTypeID(), tickets.get(0).getTripType().getTypeID());
    }

    @Test
    @Order(2)
    void testTicketBookingService_Success_MultipleTickets() {
        // Arrange
        TicketBookingRequest request = new TicketBookingRequest();
        request.setFlightId(flight.getFlightID());
        request.setTripTypeId(tripType.getTypeID());
        request.setQuantity(3);

        // Act
        Integer[] ticketIds = assertDoesNotThrow(() -> 
            ticketBookingService.ticketBookingService(request, testUser.getUserID()));

        // Assert
        assertNotNull(ticketIds);
        assertEquals(3, ticketIds.length);
        for (Integer ticketId : ticketIds) {
            assertNotNull(ticketId);
        }

        List<FlightTicket> tickets = flightTicketRepository.findAll();
        assertEquals(3, tickets.size());
    }

    @Test
    @Order(3)
    void testTicketBookingService_Failure_NotEnoughTickets() {
        // Arrange
        TicketBookingRequest request = new TicketBookingRequest();
        request.setFlightId(flight.getFlightID());
        request.setTripTypeId(tripType.getTypeID());
        request.setQuantity(11); // More than available (10)

        // Act & Assert
        BadRequestException exception = assertThrows(BadRequestException.class,
                () -> ticketBookingService.ticketBookingService(request, testUser.getUserID()));
        assertEquals("Not enough tickets available", exception.getMessage());
    }

    @Test
    @Order(4)
    void testTicketBookingService_Failure_ExactAvailableTickets() {
        // Arrange - Book all available tickets first
        TicketBookingRequest firstRequest = new TicketBookingRequest();
        firstRequest.setFlightId(flight.getFlightID());
        firstRequest.setTripTypeId(tripType.getTypeID());
        firstRequest.setQuantity(10); // All available tickets

        ticketBookingService.ticketBookingService(firstRequest, testUser.getUserID());

        // Try to book one more ticket
        TicketBookingRequest secondRequest = new TicketBookingRequest();
        secondRequest.setFlightId(flight.getFlightID());
        secondRequest.setTripTypeId(tripType.getTypeID());
        secondRequest.setQuantity(1);

        // Act & Assert
        BadRequestException exception = assertThrows(BadRequestException.class,
                () -> ticketBookingService.ticketBookingService(secondRequest, testUser.getUserID()));
        assertEquals("Not enough tickets available", exception.getMessage());
    }

    @Test
    @Order(5)
    @Transactional(propagation = Propagation.NOT_SUPPORTED)
    void testTicketBookingService_MultiThreaded_ConcurrentBooking_ShouldThrowException() throws InterruptedException {
        // Arrange
        int numberOfThreads = 5;
        int ticketsPerThread = 3; // Each thread tries to book 3 tickets
        // Total: 5 threads * 3 tickets = 15 tickets, but only 10 available
        // At least one thread should fail

        ExecutorService executorService = Executors.newFixedThreadPool(numberOfThreads);
        CountDownLatch latch = new CountDownLatch(numberOfThreads);
        CyclicBarrier barrier = new CyclicBarrier(numberOfThreads);
        AtomicInteger successCount = new AtomicInteger(0);
        AtomicInteger failureCount = new AtomicInteger(0);
        List<Exception> exceptions = new ArrayList<>();

        // Create separate users for each thread to avoid any potential issues
        String uniqueId = UUID.randomUUID().toString().substring(0, 8);
        List<User> threadUsers = new ArrayList<>();
        for (int i = 0; i < numberOfThreads; i++) {
            User threadUser = new User();
            threadUser.setEmail("threaduser_" + uniqueId + "_" + i + "@test.com");
            threadUser.setPassword("password");
            threadUser.setFirstName("Thread");
            threadUser.setLastName("User" + i);
            threadUser.setPhoneNumber("03" + uniqueId.replace("-", "").substring(0, 6) + String.format("%03d", i));
            threadUser.setStatus(User.UserStatus.ACTIVE);
            threadUser.setRole(User.UserRole.CLIENT);
            threadUsers.add(userRepository.save(threadUser));
        }

        // Act - Launch multiple threads trying to book simultaneously
        for (int i = 0; i < numberOfThreads; i++) {
            final int threadIndex = i;
            executorService.submit(() -> {
                try {
                    // Wait for all threads to be ready
                    barrier.await();
                    
                    TicketBookingRequest request = new TicketBookingRequest();
                    request.setFlightId(flight.getFlightID());
                    request.setTripTypeId(tripType.getTypeID());
                    request.setQuantity(ticketsPerThread);

                    ticketBookingService.ticketBookingService(request, threadUsers.get(threadIndex).getUserID());
                    successCount.incrementAndGet();
                } catch (BadRequestException e) {
                    failureCount.incrementAndGet();
                    synchronized (exceptions) {
                        exceptions.add(e);
                    }
                } catch (Exception e) {
                    synchronized (exceptions) {
                        exceptions.add(e);
                    }
                } finally {
                    latch.countDown();
                }
            });
        }

        // Wait for all threads to complete
        latch.await();
        executorService.shutdown();

        // Assert
        // At least one thread should have failed due to insufficient tickets
        assertTrue(failureCount.get() > 0, 
                "At least one thread should have failed when trying to book unavailable tickets");
        
        // Verify that all failures are BadRequestException with correct message
        for (Exception e : exceptions) {
            if (e instanceof BadRequestException) {
                assertEquals("Not enough tickets available", e.getMessage());
            }
        }

        // Verify total bookings don't exceed available tickets
        List<FlightTicket> allTickets = flightTicketRepository.findAll();
        int totalBookedTickets = allTickets.size();
        
        assertTrue(totalBookedTickets <= tripType.getQuantity(), 
                "Total booked tickets should not exceed available quantity");
    }

    @Test
    @Order(6)
    @Transactional(propagation = Propagation.NOT_SUPPORTED)
    void testTicketBookingService_MultiThreaded_ExactAvailableTickets_SomeShouldFail() throws InterruptedException {
        // Arrange
        int numberOfThreads = 3;
        int ticketsPerThread = 5; // Each thread tries to book 5 tickets
        // Total: 3 threads * 5 tickets = 15 tickets, but only 10 available
        // At least 2 threads should fail

        ExecutorService executorService = Executors.newFixedThreadPool(numberOfThreads);
        CountDownLatch latch = new CountDownLatch(numberOfThreads);
        CyclicBarrier barrier = new CyclicBarrier(numberOfThreads);
        AtomicInteger successCount = new AtomicInteger(0);
        AtomicInteger failureCount = new AtomicInteger(0);
        List<Exception> exceptions = new ArrayList<>();

        // Create separate users for each thread
        String uniqueId = UUID.randomUUID().toString().substring(0, 8);
        List<User> threadUsers = new ArrayList<>();
        for (int i = 0; i < numberOfThreads; i++) {
            User threadUser = new User();
            threadUser.setEmail("threaduser2_" + uniqueId + "_" + i + "@test.com");
            threadUser.setPassword("password");
            threadUser.setFirstName("Thread2");
            threadUser.setLastName("User" + i);
            threadUser.setPhoneNumber("04" + uniqueId.replace("-", "").substring(0, 6) + String.format("%03d", i));
            threadUser.setStatus(User.UserStatus.ACTIVE);
            threadUser.setRole(User.UserRole.CLIENT);
            threadUsers.add(userRepository.save(threadUser));
        }

        // Act - Launch multiple threads trying to book simultaneously
        for (int i = 0; i < numberOfThreads; i++) {
            final int threadIndex = i;
            executorService.submit(() -> {
                try {
                    // Wait for all threads to be ready
                    barrier.await();
                    
                    TicketBookingRequest request = new TicketBookingRequest();
                    request.setFlightId(flight.getFlightID());
                    request.setTripTypeId(tripType.getTypeID());
                    request.setQuantity(ticketsPerThread);

                    ticketBookingService.ticketBookingService(request, threadUsers.get(threadIndex).getUserID());
                    successCount.incrementAndGet();
                } catch (BadRequestException e) {
                    failureCount.incrementAndGet();
                    synchronized (exceptions) {
                        exceptions.add(e);
                    }
                } catch (Exception e) {
                    synchronized (exceptions) {
                        exceptions.add(e);
                    }
                } finally {
                    latch.countDown();
                }
            });
        }

        // Wait for all threads to complete
        latch.await();
        executorService.shutdown();

        // Assert
        // At least 1 thread should have failed (only 10 tickets available, 3 threads trying to book 5 each)
        // With pessimistic locking, threads execute sequentially, so at least the last thread should fail
        assertTrue(failureCount.get() >= 1, 
                "At least 1 thread should have failed when trying to book unavailable tickets");
        
        // At most 2 threads should succeed (10 tickets / 5 tickets per thread = 2)
        assertTrue(successCount.get() <= 2, 
                "At most 2 threads should succeed");
        
        // Total successful bookings should not exceed available tickets
        assertTrue(successCount.get() * ticketsPerThread <= tripType.getQuantity(),
                "Total booked tickets should not exceed available quantity");

        // Verify all failures are BadRequestException
        for (Exception e : exceptions) {
            if (e instanceof BadRequestException) {
                assertEquals("Not enough tickets available", e.getMessage());
            }
        }

        // Verify total bookings don't exceed available tickets
        List<FlightTicket> allTickets = flightTicketRepository.findAll();
        int totalBookedTickets = allTickets.size();
        
        assertTrue(totalBookedTickets <= tripType.getQuantity(), 
                "Total booked tickets should not exceed available quantity");
        assertEquals(successCount.get() * ticketsPerThread, totalBookedTickets,
                "Total booked tickets should equal successful bookings");
    }

    @Test
    @Order(7)
    @Transactional(propagation = Propagation.NOT_SUPPORTED)
    void testTicketBookingService_MultiThreaded_AllTicketsBooked_AllShouldFail() throws InterruptedException {
        // Arrange - First book all available tickets
        TicketBookingRequest firstRequest = new TicketBookingRequest();
        firstRequest.setFlightId(flight.getFlightID());
        firstRequest.setTripTypeId(tripType.getTypeID());
        firstRequest.setQuantity(10); // All available tickets

        ticketBookingService.ticketBookingService(firstRequest, testUser.getUserID());

        // Now try to book with multiple threads - all should fail
        int numberOfThreads = 3;
        ExecutorService executorService = Executors.newFixedThreadPool(numberOfThreads);
        CountDownLatch latch = new CountDownLatch(numberOfThreads);
        AtomicInteger successCount = new AtomicInteger(0);
        AtomicInteger failureCount = new AtomicInteger(0);
        List<Exception> exceptions = new ArrayList<>();

        // Create separate users for each thread
        String uniqueId = UUID.randomUUID().toString().substring(0, 8);
        List<User> threadUsers = new ArrayList<>();
        for (int i = 0; i < numberOfThreads; i++) {
            User threadUser = new User();
            threadUser.setEmail("threaduser3_" + uniqueId + "_" + i + "@test.com");
            threadUser.setPassword("password");
            threadUser.setFirstName("Thread3");
            threadUser.setLastName("User" + i);
            threadUser.setPhoneNumber("05" + uniqueId.replace("-", "").substring(0, 6) + String.format("%03d", i));
            threadUser.setStatus(User.UserStatus.ACTIVE);
            threadUser.setRole(User.UserRole.CLIENT);
            threadUsers.add(userRepository.save(threadUser));
        }

        CyclicBarrier barrier = new CyclicBarrier(numberOfThreads);

        // Act - Launch multiple threads trying to book when no tickets are available
        for (int i = 0; i < numberOfThreads; i++) {
            final int threadIndex = i;
            executorService.submit(() -> {
                try {
                    // Wait for all threads to be ready
                    barrier.await();
                    
                    TicketBookingRequest request = new TicketBookingRequest();
                    request.setFlightId(flight.getFlightID());
                    request.setTripTypeId(tripType.getTypeID());
                    request.setQuantity(1);

                    ticketBookingService.ticketBookingService(request, threadUsers.get(threadIndex).getUserID());
                    successCount.incrementAndGet();
                } catch (BadRequestException e) {
                    failureCount.incrementAndGet();
                    synchronized (exceptions) {
                        exceptions.add(e);
                    }
                } catch (Exception e) {
                    synchronized (exceptions) {
                        exceptions.add(e);
                    }
                } finally {
                    latch.countDown();
                }
            });
        }

        // Wait for all threads to complete
        latch.await();
        executorService.shutdown();

        // Assert
        // All threads should have failed
        assertEquals(numberOfThreads, failureCount.get(), 
                "All threads should have failed when no tickets are available");
        assertEquals(0, successCount.get(), 
                "No threads should have succeeded");

        // Verify all failures are BadRequestException
        for (Exception e : exceptions) {
            assertTrue(e instanceof BadRequestException, 
                    "All exceptions should be BadRequestException");
            assertEquals("Not enough tickets available", e.getMessage());
        }
    }
}


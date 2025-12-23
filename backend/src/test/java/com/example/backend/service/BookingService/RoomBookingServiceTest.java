package com.example.backend.service.BookingService;

import com.example.backend.dto.BookingDTOs.CreateBookingDTO;
import com.example.backend.dto.BookingDTOs.RoomTypeBookingDTO;
import com.example.backend.entity.BookingTransaction;
import com.example.backend.entity.Hotel;
import com.example.backend.entity.RoomBooking;
import com.example.backend.entity.RoomType;
import com.example.backend.entity.User;
import com.example.backend.exception.BadRequestException;
import com.example.backend.repository.BookingTransactionRepository;
import com.example.backend.repository.HotelRepository;
import com.example.backend.repository.RoomBookingRepository;
import com.example.backend.repository.RoomTypeRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.AuthService.JwtAuthService;

import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.CyclicBarrier;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class RoomBookingServiceTest {

    @Autowired
    private RoomBookingService roomBookingService;

    @Autowired
    private RoomBookingRepository roomBookingRepository;

    @Autowired
    private RoomTypeRepository roomTypeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private HotelRepository hotelRepository;

    @Autowired
    private BookingTransactionRepository bookingTransactionRepository;

    @MockBean
    private JwtAuthService jwtAuthService;

    private User testUser;
    private User hotelAdmin;
    private Hotel hotel;
    private RoomType roomType;

    @BeforeEach
    void setup() {
        // Clean up repositories
        roomBookingRepository.deleteAll();
        bookingTransactionRepository.deleteAll();
        roomTypeRepository.deleteAll();
        hotelRepository.deleteAll();
        userRepository.deleteAll();

        // Create test user
        testUser = new User();
        testUser.setEmail("testuser@test.com");
        testUser.setPassword("password");
        testUser.setFirstName("Test");
        testUser.setLastName("User");
        testUser.setPhoneNumber("01000000000");
        testUser.setStatus(User.UserStatus.ACTIVE);
        testUser.setRole(User.UserRole.CLIENT);
        testUser = userRepository.save(testUser);

        // Create hotel admin
        hotelAdmin = new User();
        hotelAdmin.setEmail("hoteladmin@test.com");
        hotelAdmin.setPassword("password");
        hotelAdmin.setFirstName("Hotel");
        hotelAdmin.setLastName("Admin");
        hotelAdmin.setPhoneNumber("01000000001");
        hotelAdmin.setStatus(User.UserStatus.ACTIVE);
        hotelAdmin.setRole(User.UserRole.HOTEL_ADMIN);
        hotelAdmin = userRepository.save(hotelAdmin);

        // Create hotel
        hotel = new Hotel();
        hotel.setHotelName("Test Hotel");
        hotel.setLatitude(30.0);
        hotel.setLongitude(31.0);
        hotel.setCity("Cairo");
        hotel.setCountry("Egypt");
        hotel.setAdmin(hotelAdmin);
        hotel.setCreatedAt(LocalDateTime.now());
        hotel.setStatus(Hotel.Status.ACTIVE);
        hotel = hotelRepository.save(hotel);

        // Create room type
        roomType = new RoomType();
        roomType.setRoomTypeName("Deluxe");
        roomType.setNumberOfGuests(2);
        roomType.setHotel(hotel);
        roomType.setQuantity(10);
        roomType.setDescription("Nice room");
        roomType.setPrice(300f);
        roomType = roomTypeRepository.save(roomType);
    }

    @Test
    @Order(1)
    void testBookingService_Success_SingleRoom() {
        // Arrange
        CreateBookingDTO createBookingDTO = new CreateBookingDTO();
        createBookingDTO.setHotelID(hotel.getHotelID());
        createBookingDTO.setCheckIn(LocalDate.now().plusDays(1));
        createBookingDTO.setCheckOut(LocalDate.now().plusDays(3));
        createBookingDTO.setNoOfGuests(2);

        RoomTypeBookingDTO roomTypeBookingDTO = new RoomTypeBookingDTO();
        roomTypeBookingDTO.setRoomTypeID(roomType.getRoomTypeID());
        roomTypeBookingDTO.setNoOfRooms(1);
        createBookingDTO.setRoomTypeBookingDTO(new RoomTypeBookingDTO[]{roomTypeBookingDTO});

        // Act
        assertDoesNotThrow(() -> roomBookingService.bookingService(createBookingDTO, testUser.getUserID()));

        // Assert
        List<RoomBooking> bookings = roomBookingRepository.findAll();
        assertEquals(1, bookings.size());
        assertEquals(1, bookings.get(0).getNoOfRooms());
        assertEquals(roomType.getRoomTypeID(), bookings.get(0).getRoomType().getRoomTypeID());

        List<BookingTransaction> transactions = bookingTransactionRepository.findAll();
        assertEquals(1, transactions.size());
        assertEquals(testUser.getUserID(), transactions.get(0).getUser().getUserID());
    }

    @Test
    @Order(2)
    void testBookingService_Success_MultipleRooms() {
        // Arrange
        CreateBookingDTO createBookingDTO = new CreateBookingDTO();
        createBookingDTO.setHotelID(hotel.getHotelID());
        createBookingDTO.setCheckIn(LocalDate.now().plusDays(1));
        createBookingDTO.setCheckOut(LocalDate.now().plusDays(3));
        createBookingDTO.setNoOfGuests(4);

        RoomTypeBookingDTO roomTypeBookingDTO = new RoomTypeBookingDTO();
        roomTypeBookingDTO.setRoomTypeID(roomType.getRoomTypeID());
        roomTypeBookingDTO.setNoOfRooms(3);
        createBookingDTO.setRoomTypeBookingDTO(new RoomTypeBookingDTO[]{roomTypeBookingDTO});

        // Act
        assertDoesNotThrow(() -> roomBookingService.bookingService(createBookingDTO, testUser.getUserID()));

        // Assert
        List<RoomBooking> bookings = roomBookingRepository.findAll();
        assertEquals(1, bookings.size());
        assertEquals(3, bookings.get(0).getNoOfRooms());
    }

    @Test
    @Order(3)
    void testBookingService_Failure_NotEnoughRooms() {
        // Arrange
        CreateBookingDTO createBookingDTO = new CreateBookingDTO();
        createBookingDTO.setHotelID(hotel.getHotelID());
        createBookingDTO.setCheckIn(LocalDate.now().plusDays(1));
        createBookingDTO.setCheckOut(LocalDate.now().plusDays(3));
        createBookingDTO.setNoOfGuests(2);

        RoomTypeBookingDTO roomTypeBookingDTO = new RoomTypeBookingDTO();
        roomTypeBookingDTO.setRoomTypeID(roomType.getRoomTypeID());
        roomTypeBookingDTO.setNoOfRooms(11); // More than available (10)
        createBookingDTO.setRoomTypeBookingDTO(new RoomTypeBookingDTO[]{roomTypeBookingDTO});

        // Act & Assert
        BadRequestException exception = assertThrows(BadRequestException.class,
                () -> roomBookingService.bookingService(createBookingDTO, testUser.getUserID()));
        assertEquals("this number of rooms is Not available ", exception.getMessage());
    }

    @Test
    @Order(4)
    void testBookingService_Failure_ExactAvailableRooms() {
        // Arrange - Book all available rooms first
        CreateBookingDTO firstBooking = new CreateBookingDTO();
        firstBooking.setHotelID(hotel.getHotelID());
        firstBooking.setCheckIn(LocalDate.now().plusDays(1));
        firstBooking.setCheckOut(LocalDate.now().plusDays(3));
        firstBooking.setNoOfGuests(2);

        RoomTypeBookingDTO firstRoomTypeBooking = new RoomTypeBookingDTO();
        firstRoomTypeBooking.setRoomTypeID(roomType.getRoomTypeID());
        firstRoomTypeBooking.setNoOfRooms(10); // All available rooms
        firstBooking.setRoomTypeBookingDTO(new RoomTypeBookingDTO[]{firstRoomTypeBooking});

        roomBookingService.bookingService(firstBooking, testUser.getUserID());

        // Try to book one more room
        CreateBookingDTO secondBooking = new CreateBookingDTO();
        secondBooking.setHotelID(hotel.getHotelID());
        secondBooking.setCheckIn(LocalDate.now().plusDays(1));
        secondBooking.setCheckOut(LocalDate.now().plusDays(3));
        secondBooking.setNoOfGuests(2);

        RoomTypeBookingDTO secondRoomTypeBooking = new RoomTypeBookingDTO();
        secondRoomTypeBooking.setRoomTypeID(roomType.getRoomTypeID());
        secondRoomTypeBooking.setNoOfRooms(1);
        secondBooking.setRoomTypeBookingDTO(new RoomTypeBookingDTO[]{secondRoomTypeBooking});

        // Act & Assert
        BadRequestException exception = assertThrows(BadRequestException.class,
                () -> roomBookingService.bookingService(secondBooking, testUser.getUserID()));
        assertEquals("this number of rooms is Not available ", exception.getMessage());
    }

    @Test
    @Order(5)
    void testBookingService_Success_OverlappingDates() {
        // Arrange - Book rooms for dates 1-3
        CreateBookingDTO firstBooking = new CreateBookingDTO();
        firstBooking.setHotelID(hotel.getHotelID());
        firstBooking.setCheckIn(LocalDate.now().plusDays(1));
        firstBooking.setCheckOut(LocalDate.now().plusDays(3));
        firstBooking.setNoOfGuests(2);

        RoomTypeBookingDTO firstRoomTypeBooking = new RoomTypeBookingDTO();
        firstRoomTypeBooking.setRoomTypeID(roomType.getRoomTypeID());
        firstRoomTypeBooking.setNoOfRooms(5);
        firstBooking.setRoomTypeBookingDTO(new RoomTypeBookingDTO[]{firstRoomTypeBooking});

        roomBookingService.bookingService(firstBooking, testUser.getUserID());

        // Book rooms for dates 2-4 (overlapping)
        CreateBookingDTO secondBooking = new CreateBookingDTO();
        secondBooking.setHotelID(hotel.getHotelID());
        secondBooking.setCheckIn(LocalDate.now().plusDays(2));
        secondBooking.setCheckOut(LocalDate.now().plusDays(4));
        secondBooking.setNoOfGuests(2);

        RoomTypeBookingDTO secondRoomTypeBooking = new RoomTypeBookingDTO();
        secondRoomTypeBooking.setRoomTypeID(roomType.getRoomTypeID());
        secondRoomTypeBooking.setNoOfRooms(3);
        secondBooking.setRoomTypeBookingDTO(new RoomTypeBookingDTO[]{secondRoomTypeBooking});

        // Act
        assertDoesNotThrow(() -> roomBookingService.bookingService(secondBooking, testUser.getUserID()));

        // Assert - Should succeed as there are enough rooms (10 total, 5 booked for overlap period)
        List<RoomBooking> bookings = roomBookingRepository.findAll();
        assertEquals(2, bookings.size());
    }

    @Test
    @Order(6)
    void testBookingService_Success_NonOverlappingDates() {
        // Arrange - Book rooms for dates 1-3
        CreateBookingDTO firstBooking = new CreateBookingDTO();
        firstBooking.setHotelID(hotel.getHotelID());
        firstBooking.setCheckIn(LocalDate.now().plusDays(1));
        firstBooking.setCheckOut(LocalDate.now().plusDays(3));
        firstBooking.setNoOfGuests(2);

        RoomTypeBookingDTO firstRoomTypeBooking = new RoomTypeBookingDTO();
        firstRoomTypeBooking.setRoomTypeID(roomType.getRoomTypeID());
        firstRoomTypeBooking.setNoOfRooms(5); // Some rooms
        firstBooking.setRoomTypeBookingDTO(new RoomTypeBookingDTO[]{firstRoomTypeBooking});

        roomBookingService.bookingService(firstBooking, testUser.getUserID());

        // Book rooms for dates 5-7 (non-overlapping, with gap on day 4)
        CreateBookingDTO secondBooking = new CreateBookingDTO();
        secondBooking.setHotelID(hotel.getHotelID());
        secondBooking.setCheckIn(LocalDate.now().plusDays(5));
        secondBooking.setCheckOut(LocalDate.now().plusDays(7));
        secondBooking.setNoOfGuests(2);

        RoomTypeBookingDTO secondRoomTypeBooking = new RoomTypeBookingDTO();
        secondRoomTypeBooking.setRoomTypeID(roomType.getRoomTypeID());
        secondRoomTypeBooking.setNoOfRooms(5); // Should work as dates don't overlap
        secondBooking.setRoomTypeBookingDTO(new RoomTypeBookingDTO[]{secondRoomTypeBooking});

        // Act
        assertDoesNotThrow(() -> roomBookingService.bookingService(secondBooking, testUser.getUserID()));

        // Assert
        List<RoomBooking> bookings = roomBookingRepository.findAll();
        assertEquals(2, bookings.size());
    }

    @Test
    @Order(7)
    @Transactional(propagation = Propagation.NOT_SUPPORTED)
    void testBookingService_MultiThreaded_ConcurrentBooking_ShouldThrowException() throws InterruptedException {
        // Arrange
        int numberOfThreads = 5;
        int roomsPerThread = 3; // Each thread tries to book 3 rooms
        // Total: 5 threads * 3 rooms = 15 rooms, but only 10 available
        // At least one thread should fail

        ExecutorService executorService = Executors.newFixedThreadPool(numberOfThreads);
        CountDownLatch latch = new CountDownLatch(numberOfThreads);
        CyclicBarrier barrier = new CyclicBarrier(numberOfThreads);
        AtomicInteger successCount = new AtomicInteger(0);
        AtomicInteger failureCount = new AtomicInteger(0);
        List<Exception> exceptions = new ArrayList<>();

        LocalDate checkIn = LocalDate.now().plusDays(1);
        LocalDate checkOut = LocalDate.now().plusDays(3);

        // Create separate users for each thread to avoid any potential issues
        List<User> threadUsers = new ArrayList<>();
        for (int i = 0; i < numberOfThreads; i++) {
            User threadUser = new User();
            threadUser.setEmail("threaduser" + i + "@test.com");
            threadUser.setPassword("password");
            threadUser.setFirstName("Thread");
            threadUser.setLastName("User" + i);
            threadUser.setPhoneNumber("01000000" + String.format("%03d", i));
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
                    
                    CreateBookingDTO createBookingDTO = new CreateBookingDTO();
                    createBookingDTO.setHotelID(hotel.getHotelID());
                    createBookingDTO.setCheckIn(checkIn);
                    createBookingDTO.setCheckOut(checkOut);
                    createBookingDTO.setNoOfGuests(2);

                    RoomTypeBookingDTO roomTypeBookingDTO = new RoomTypeBookingDTO();
                    roomTypeBookingDTO.setRoomTypeID(roomType.getRoomTypeID());
                    roomTypeBookingDTO.setNoOfRooms(roomsPerThread);
                    createBookingDTO.setRoomTypeBookingDTO(new RoomTypeBookingDTO[]{roomTypeBookingDTO});

                    roomBookingService.bookingService(createBookingDTO, threadUsers.get(threadIndex).getUserID());
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
        // At least one thread should have failed due to insufficient rooms
        assertTrue(failureCount.get() > 0, 
                "At least one thread should have failed when trying to book unavailable rooms");
        
        // Verify that all failures are BadRequestException with correct message
        for (Exception e : exceptions) {
            if (e instanceof BadRequestException) {
                assertEquals("this number of rooms is Not available ", e.getMessage());
            }
        }

        // Verify total bookings don't exceed available rooms
        List<RoomBooking> allBookings = roomBookingRepository.findAll();
        int totalBookedRooms = allBookings.stream()
                .mapToInt(RoomBooking::getNoOfRooms)
                .sum();
        
        assertTrue(totalBookedRooms <= roomType.getQuantity(), 
                "Total booked rooms should not exceed available quantity");
    }

    @Test
    @Order(8)
    @Transactional(propagation = Propagation.NOT_SUPPORTED)
    void testBookingService_MultiThreaded_ExactAvailableRooms_SomeShouldFail() throws InterruptedException {
        // Arrange
        int numberOfThreads = 3;
        int roomsPerThread = 5; // Each thread tries to book 5 rooms
        // Total: 3 threads * 5 rooms = 15 rooms, but only 10 available
        // At least 2 threads should fail

        ExecutorService executorService = Executors.newFixedThreadPool(numberOfThreads);
        CountDownLatch latch = new CountDownLatch(numberOfThreads);
        CyclicBarrier barrier = new CyclicBarrier(numberOfThreads);
        AtomicInteger successCount = new AtomicInteger(0);
        AtomicInteger failureCount = new AtomicInteger(0);
        List<Exception> exceptions = new ArrayList<>();

        LocalDate checkIn = LocalDate.now().plusDays(1);
        LocalDate checkOut = LocalDate.now().plusDays(3);

        // Create separate users for each thread
        List<User> threadUsers = new ArrayList<>();
        for (int i = 0; i < numberOfThreads; i++) {
            User threadUser = new User();
            threadUser.setEmail("threaduser2_" + i + "@test.com");
            threadUser.setPassword("password");
            threadUser.setFirstName("Thread2");
            threadUser.setLastName("User" + i);
            threadUser.setPhoneNumber("02000000" + String.format("%03d", i));
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
                    
                    CreateBookingDTO createBookingDTO = new CreateBookingDTO();
                    createBookingDTO.setHotelID(hotel.getHotelID());
                    createBookingDTO.setCheckIn(checkIn);
                    createBookingDTO.setCheckOut(checkOut);
                    createBookingDTO.setNoOfGuests(2);

                    RoomTypeBookingDTO roomTypeBookingDTO = new RoomTypeBookingDTO();
                    roomTypeBookingDTO.setRoomTypeID(roomType.getRoomTypeID());
                    roomTypeBookingDTO.setNoOfRooms(roomsPerThread);
                    createBookingDTO.setRoomTypeBookingDTO(new RoomTypeBookingDTO[]{roomTypeBookingDTO});

                    roomBookingService.bookingService(createBookingDTO, threadUsers.get(threadIndex).getUserID());
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
        // At least 1 thread should have failed (only 10 rooms available, 3 threads trying to book 5 each)
        // With pessimistic locking, threads execute sequentially, so at least the last thread should fail
        assertTrue(failureCount.get() >= 1, 
                "At least 1 thread should have failed when trying to book unavailable rooms");
        
        // At most 2 threads should succeed (10 rooms / 5 rooms per thread = 2)
        assertTrue(successCount.get() <= 2, 
                "At most 2 threads should succeed");
        
        // Total successful bookings should not exceed available rooms
        assertTrue(successCount.get() * roomsPerThread <= roomType.getQuantity(),
                "Total booked rooms should not exceed available quantity");

        // Verify all failures are BadRequestException
        for (Exception e : exceptions) {
            if (e instanceof BadRequestException) {
                assertEquals("this number of rooms is Not available ", e.getMessage());
            }
        }

        // Verify total bookings don't exceed available rooms
        List<RoomBooking> allBookings = roomBookingRepository.findAll();
        int totalBookedRooms = allBookings.stream()
                .mapToInt(RoomBooking::getNoOfRooms)
                .sum();
        
        assertTrue(totalBookedRooms <= roomType.getQuantity(), 
                "Total booked rooms should not exceed available quantity");
        assertEquals(successCount.get() * roomsPerThread, totalBookedRooms,
                "Total booked rooms should equal successful bookings");
    }

    @Test
    @Order(9)
    @Transactional(propagation = Propagation.NOT_SUPPORTED)
    void testBookingService_MultiThreaded_AllRoomsBooked_AllShouldFail() throws InterruptedException {
        // Arrange - First book all available rooms
        CreateBookingDTO firstBooking = new CreateBookingDTO();
        firstBooking.setHotelID(hotel.getHotelID());
        firstBooking.setCheckIn(LocalDate.now().plusDays(1));
        firstBooking.setCheckOut(LocalDate.now().plusDays(3));
        firstBooking.setNoOfGuests(2);

        RoomTypeBookingDTO firstRoomTypeBooking = new RoomTypeBookingDTO();
        firstRoomTypeBooking.setRoomTypeID(roomType.getRoomTypeID());
        firstRoomTypeBooking.setNoOfRooms(10); // All available rooms
        firstBooking.setRoomTypeBookingDTO(new RoomTypeBookingDTO[]{firstRoomTypeBooking});

        roomBookingService.bookingService(firstBooking, testUser.getUserID());

        // Now try to book with multiple threads - all should fail
        int numberOfThreads = 3;
        ExecutorService executorService = Executors.newFixedThreadPool(numberOfThreads);
        CountDownLatch latch = new CountDownLatch(numberOfThreads);
        AtomicInteger successCount = new AtomicInteger(0);
        AtomicInteger failureCount = new AtomicInteger(0);
        List<Exception> exceptions = new ArrayList<>();

        LocalDate checkIn = LocalDate.now().plusDays(1);
        LocalDate checkOut = LocalDate.now().plusDays(3);

        // Create separate users for each thread
        List<User> threadUsers = new ArrayList<>();
        for (int i = 0; i < numberOfThreads; i++) {
            User threadUser = new User();
            threadUser.setEmail("threaduser3_" + i + "@test.com");
            threadUser.setPassword("password");
            threadUser.setFirstName("Thread3");
            threadUser.setLastName("User" + i);
            threadUser.setPhoneNumber("03000000" + String.format("%03d", i));
            threadUser.setStatus(User.UserStatus.ACTIVE);
            threadUser.setRole(User.UserRole.CLIENT);
            threadUsers.add(userRepository.save(threadUser));
        }

        CyclicBarrier barrier = new CyclicBarrier(numberOfThreads);

        // Act - Launch multiple threads trying to book when no rooms are available
        for (int i = 0; i < numberOfThreads; i++) {
            final int threadIndex = i;
            executorService.submit(() -> {
                try {
                    // Wait for all threads to be ready
                    barrier.await();
                    
                    CreateBookingDTO createBookingDTO = new CreateBookingDTO();
                    createBookingDTO.setHotelID(hotel.getHotelID());
                    createBookingDTO.setCheckIn(checkIn);
                    createBookingDTO.setCheckOut(checkOut);
                    createBookingDTO.setNoOfGuests(2);

                    RoomTypeBookingDTO roomTypeBookingDTO = new RoomTypeBookingDTO();
                    roomTypeBookingDTO.setRoomTypeID(roomType.getRoomTypeID());
                    roomTypeBookingDTO.setNoOfRooms(1);
                    createBookingDTO.setRoomTypeBookingDTO(new RoomTypeBookingDTO[]{roomTypeBookingDTO});

                    roomBookingService.bookingService(createBookingDTO, threadUsers.get(threadIndex).getUserID());
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
                "All threads should have failed when no rooms are available");
        assertEquals(0, successCount.get(), 
                "No threads should have succeeded");

        // Verify all failures are BadRequestException
        for (Exception e : exceptions) {
            assertTrue(e instanceof BadRequestException, 
                    "All exceptions should be BadRequestException");
            assertEquals("this number of rooms is Not available ", e.getMessage());
        }
    }
}


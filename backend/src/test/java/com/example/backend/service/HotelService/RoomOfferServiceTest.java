package com.example.backend.service.HotelService;

import com.example.backend.dto.HotelDTO.RoomOfferRequest;
import com.example.backend.dto.HotelDTO.RoomOfferResponse;
import com.example.backend.entity.Hotel;
import com.example.backend.entity.RoomOffer;
import com.example.backend.entity.RoomType;
import com.example.backend.entity.User;
import com.example.backend.repository.HotelRepository;
import com.example.backend.repository.RoomOfferRepository;
import com.example.backend.repository.RoomTypeRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.AuthService.JwtAuthService;

import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class RoomOfferServiceTest {

    @Autowired
    private RoomOfferService roomOfferService;

    @Autowired
    private RoomOfferRepository roomOfferRepository;

    @Autowired
    private RoomTypeRepository roomTypeRepository;

    @Autowired
    private HotelRepository hotelRepository;

    @Autowired
    private UserRepository userRepository;

    @MockBean
    private JwtAuthService jwtAuthService;

    private User admin;
    private Hotel hotel;
    private RoomType roomType;

    @BeforeEach
    void setup() {
        roomOfferRepository.deleteAll();
        roomTypeRepository.deleteAll();
        hotelRepository.deleteAll();
        userRepository.deleteAll();

        // Create admin user
        admin = new User();
        admin.setFirstName("Admin");
        admin.setLastName("User");
        admin.setEmail("admin@example.com");
        admin.setPassword("password");
        admin.setPhoneNumber("123-456-7890");
        admin.setRole(User.UserRole.HOTEL_ADMIN);
        admin = userRepository.save(admin);

        // Create hotel
        hotel = new Hotel();
        hotel.setHotelName("Test Hotel");
        hotel.setLatitude(40.7128);
        hotel.setLongitude(-74.0060);
        hotel.setCity("Test City");
        hotel.setCountry("Test Country");
        hotel.setAdmin(admin);
        hotel = hotelRepository.save(hotel);

        // Create room type
        roomType = new RoomType();
        roomType.setRoomTypeName("Deluxe Room");
        roomType.setNumberOfGuests(2);
        roomType.setHotel(hotel);
        roomType.setQuantity(10);
        roomType.setDescription("A deluxe room");
        roomType.setPrice(100.0f);
        roomType = roomTypeRepository.save(roomType);
    }

    @Test
    @Order(1)
    void testAddRoomOffer_Success() {
        RoomOfferRequest request = new RoomOfferRequest();
        request.setOfferName("Summer Discount");
        request.setDiscountValue(20.0f);
        request.setRoomTypeId(roomType.getRoomTypeID());
        request.setHotelId(hotel.getHotelID());
        request.setStartDate(LocalDateTime.now().plusDays(1));
        request.setEndDate(LocalDateTime.now().plusDays(30));
        request.setMaxUsage(100);
        request.setMinStayNights(2);
        request.setMinBookingAmount(50.0f);
        request.setDescription("Summer discount offer");

        RoomOfferResponse response = roomOfferService.addRoomOffer(request);

        assertNotNull(response);
        assertEquals("Summer Discount", response.getOfferName());
        assertEquals(20.0f, response.getDiscountValue());
        assertEquals("Deluxe Room", response.getRoomTypeName());
        assertEquals("Test Hotel", response.getHotelName());
        assertTrue(response.getIsActive());
        assertEquals(0, response.getCurrentUsage());
    }

    @Test
    @Order(2)
    void testAddRoomOffer_HotelNotFound() {
        RoomOfferRequest request = new RoomOfferRequest();
        request.setOfferName("Test Offer");
        request.setDiscountValue(10.0f);
        request.setHotelId(999); // Non-existent hotel
        request.setStartDate(LocalDateTime.now());
        request.setEndDate(LocalDateTime.now().plusDays(1));

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            roomOfferService.addRoomOffer(request);
        });
        assertEquals("Hotel not found", exception.getMessage());
    }

    @Test
    @Order(3)
    void testAddRoomOffer_RoomTypeNotFound() {
        RoomOfferRequest request = new RoomOfferRequest();
        request.setOfferName("Test Offer");
        request.setDiscountValue(10.0f);
        request.setHotelId(hotel.getHotelID());
        request.setRoomTypeId(999); // Non-existent room type
        request.setStartDate(LocalDateTime.now());
        request.setEndDate(LocalDateTime.now().plusDays(1));

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            roomOfferService.addRoomOffer(request);
        });
        assertEquals("Room type not found", exception.getMessage());
    }

    @Test
    @Order(4)
    void testAddRoomOffer_RoomTypeNotBelongToHotel() {
        // Create another admin user
        User anotherAdmin = new User();
        anotherAdmin.setFirstName("Another");
        anotherAdmin.setLastName("Admin");
        anotherAdmin.setEmail("anotheradmin@example.com");
        anotherAdmin.setPassword("password");
        anotherAdmin.setPhoneNumber("098-765-4321");
        anotherAdmin.setRole(User.UserRole.HOTEL_ADMIN);
        anotherAdmin = userRepository.save(anotherAdmin);

        // Create another hotel
        Hotel anotherHotel = new Hotel();
        anotherHotel.setHotelName("Another Hotel");
        anotherHotel.setLatitude(34.0522);
        anotherHotel.setLongitude(-118.2437);
        anotherHotel.setCity("Another City");
        anotherHotel.setCountry("Another Country");
        anotherHotel.setAdmin(anotherAdmin);
        anotherHotel = hotelRepository.save(anotherHotel);

        // Create room type for another hotel
        RoomType anotherRoomType = new RoomType();
        anotherRoomType.setRoomTypeName("Standard Room");
        anotherRoomType.setNumberOfGuests(2);
        anotherRoomType.setHotel(anotherHotel);
        anotherRoomType.setQuantity(5);
        anotherRoomType.setDescription("A standard room");
        anotherRoomType.setPrice(80.0f);
        anotherRoomType = roomTypeRepository.save(anotherRoomType);

        RoomOfferRequest request = new RoomOfferRequest();
        request.setOfferName("Test Offer");
        request.setDiscountValue(10.0f);
        request.setHotelId(hotel.getHotelID());
        request.setRoomTypeId(anotherRoomType.getRoomTypeID()); // Room type from another hotel
        request.setStartDate(LocalDateTime.now());
        request.setEndDate(LocalDateTime.now().plusDays(1));

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            roomOfferService.addRoomOffer(request);
        });
        assertEquals("Room type does not belong to your hotel", exception.getMessage());
    }

    @Test
    @Order(5)
    void testGetRoomOffersByHotel() {
        // Add an offer
        RoomOfferRequest request = new RoomOfferRequest();
        request.setOfferName("Winter Discount");
        request.setDiscountValue(15.0f);
        request.setRoomTypeId(roomType.getRoomTypeID());
        request.setHotelId(hotel.getHotelID());
        request.setStartDate(LocalDateTime.now().plusDays(1));
        request.setEndDate(LocalDateTime.now().plusDays(30));
        request.setMaxUsage(50);
        request.setMinStayNights(1);
        request.setMinBookingAmount(30.0f);
        request.setDescription("Winter discount offer");

        roomOfferService.addRoomOffer(request);

        List<RoomOfferResponse> offers = roomOfferService.getRoomOffersByHotel(hotel.getHotelID());

        assertNotNull(offers);
        assertEquals(1, offers.size());
        assertEquals("Winter Discount", offers.get(0).getOfferName());
    }

    @Test
    @Order(6)
    void testDeleteRoomOffer_Success() {
        // Add an offer
        RoomOfferRequest request = new RoomOfferRequest();
        request.setOfferName("Delete Test Offer");
        request.setDiscountValue(25.0f);
        request.setRoomTypeId(roomType.getRoomTypeID());
        request.setHotelId(hotel.getHotelID());
        request.setStartDate(LocalDateTime.now().plusDays(1));
        request.setEndDate(LocalDateTime.now().plusDays(30));
        request.setMaxUsage(10);
        request.setMinStayNights(3);
        request.setMinBookingAmount(100.0f);
        request.setDescription("Offer to delete");

        RoomOfferResponse addedOffer = roomOfferService.addRoomOffer(request);

        // Delete the offer
        roomOfferService.deleteRoomOffer(addedOffer.getRoomOfferId(), hotel.getHotelID());

        // Verify it's deleted
        List<RoomOfferResponse> offers = roomOfferService.getRoomOffersByHotel(hotel.getHotelID());
        assertEquals(0, offers.size());
    }

    @Test
    @Order(7)
    void testDeleteRoomOffer_NotFound() {
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            roomOfferService.deleteRoomOffer(999, hotel.getHotelID()); // Non-existent offer
        });
        assertEquals("Offer not found", exception.getMessage());
    }

    @Test
    @Order(8)
    void testDeleteRoomOffer_NotAuthorized() {
        // Create another admin user
        User anotherAdmin = new User();
        anotherAdmin.setFirstName("Another");
        anotherAdmin.setLastName("Admin");
        anotherAdmin.setEmail("anotheradmin2@example.com");
        anotherAdmin.setPassword("password");
        anotherAdmin.setPhoneNumber("098-765-4322");
        anotherAdmin.setRole(User.UserRole.HOTEL_ADMIN);
        anotherAdmin = userRepository.save(anotherAdmin);

        // Create another hotel
        Hotel anotherHotel = new Hotel();
        anotherHotel.setHotelName("Another Hotel");
        anotherHotel.setLatitude(34.0522);
        anotherHotel.setLongitude(-118.2437);
        anotherHotel.setCity("Another City");
        anotherHotel.setCountry("Another Country");
        anotherHotel.setAdmin(anotherAdmin);
        anotherHotel = hotelRepository.save(anotherHotel);

        // Add offer to another hotel
        RoomType anotherRoomType = new RoomType();
        anotherRoomType.setRoomTypeName("Suite");
        anotherRoomType.setNumberOfGuests(4);
        anotherRoomType.setHotel(anotherHotel);
        anotherRoomType.setQuantity(2);
        anotherRoomType.setDescription("A suite");
        anotherRoomType.setPrice(200.0f);
        anotherRoomType = roomTypeRepository.save(anotherRoomType);

        RoomOfferRequest request = new RoomOfferRequest();
        request.setOfferName("Unauthorized Delete Offer");
        request.setDiscountValue(30.0f);
        request.setRoomTypeId(anotherRoomType.getRoomTypeID());
        request.setHotelId(anotherHotel.getHotelID());
        request.setStartDate(LocalDateTime.now().plusDays(1));
        request.setEndDate(LocalDateTime.now().plusDays(30));
        request.setMaxUsage(5);
        request.setMinStayNights(1);
        request.setMinBookingAmount(150.0f);
        request.setDescription("Offer for unauthorized delete test");

        RoomOfferResponse addedOffer = roomOfferService.addRoomOffer(request);

        // Try to delete from wrong hotel
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            roomOfferService.deleteRoomOffer(addedOffer.getRoomOfferId(), hotel.getHotelID());
        });
        assertEquals("You are not authorized to delete this offer", exception.getMessage());
    }
}
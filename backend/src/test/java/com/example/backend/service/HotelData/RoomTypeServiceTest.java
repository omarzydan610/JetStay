package com.example.backend.service.HotelData;

import com.example.backend.dto.RoomTypeRequest;
import com.example.backend.entity.Hotel;
import com.example.backend.entity.RoomType;
import com.example.backend.entity.User;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.exception.UnauthorizedException;
import com.example.backend.repository.HotelRepository;
import com.example.backend.repository.RoomTypeRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.AuthService.JwtAuthService;
import com.example.backend.service.Hotel_data.RoomTypeService;

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
public class RoomTypeServiceTest {

    @Autowired
    private RoomTypeService roomTypeService;

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

    @BeforeEach
    void setup() {
        roomTypeRepository.deleteAll();
        hotelRepository.deleteAll();
        userRepository.deleteAll();

        admin = new User();
        admin.setEmail("admin@test.com");
        admin.setPassword("pass");
        admin.setFirstName("Test");
        admin.setLastName("Admin");
        admin.setPhoneNumber("01000000000");
        admin = userRepository.save(admin);

        hotel = new Hotel();
        hotel.setHotelName("Test Hotel");
        hotel.setLatitude(30.0);
        hotel.setLongitude(31.0);
        hotel.setCity("Cairo");
        hotel.setCountry("Egypt");
        hotel.setAdmin(admin);
        hotel.setCreatedAt(LocalDateTime.now());
        hotel = hotelRepository.save(hotel);
    }

    // 1
    @Test
    @Order(1)
    void testAddRoomTypeSuccess() {
        RoomTypeRequest dto = new RoomTypeRequest();
        dto.setHotelId(hotel.getHotelID());
        dto.setRoomTypeName("Deluxe");
        dto.setPrice(300f);
        dto.setDescription("Nice room");
        dto.setQuantity(3);
        dto.setNumberOfGuests(2);

        RoomType created = roomTypeService.addRoomType(dto);

        assertNotNull(created);
        assertNotNull(created.getRoomTypeID());
        assertEquals("Deluxe", created.getRoomTypeName());
    }

    // 2
    @Test
    @Order(2)
    void testGetRoomTypeById() {
        RoomType saved = roomTypeRepository.save(
                new RoomType(null, "Suite", 2, hotel, 5, "Desc", 200f));

        RoomType found = roomTypeService.getRoomTypeById(hotel.getHotelID(), saved.getRoomTypeID());

        assertNotNull(found);
        assertEquals("Suite", found.getRoomTypeName());
    }

    // 3
    @Test
    @Order(3)
    void testGetRoomTypesByHotelId() {
        roomTypeRepository.save(new RoomType(null, "Single", 1, hotel, 10, "A", 100f));
        roomTypeRepository.save(new RoomType(null, "Double", 2, hotel, 6, "B", 150f));

        List<?> list = roomTypeService.getRoomTypesByHotelId(hotel.getHotelID());

        assertEquals(2, list.size());
    }

    // 4
    @Test
    @Order(4)
    void testUpdateRoomTypeSuccess() {
        RoomType saved = roomTypeRepository.save(
                new RoomType(null, "OldName", 2, hotel, 5, "Old", 100f));

        RoomTypeRequest dto = new RoomTypeRequest();
        dto.setRoomTypeName("NewName");
        dto.setPrice(400f);
        dto.setDescription("Updated");
        dto.setQuantity(8);
        dto.setNumberOfGuests(3);

        RoomType updated = roomTypeService.updateRoomType(dto, saved.getRoomTypeID());

        assertEquals("NewName", updated.getRoomTypeName());
        assertEquals(400f, updated.getPrice());
    }

    // 5
    @Test
    @Order(5)
    void testUpdateRoomType_NotFound() {
        RoomTypeRequest dto = new RoomTypeRequest();
        dto.setRoomTypeName("Fail");

        assertThrows(ResourceNotFoundException.class,
                () -> roomTypeService.updateRoomType(dto, -1));
    }

    // 6
    @Test
    @Order(6)
    void testDeleteRoomType() {
        RoomType saved = roomTypeRepository.save(
                new RoomType(null, "Del", 2, hotel, 4, "D", 150f));

        roomTypeService.deleteRoomType(hotel.getHotelID(), saved.getRoomTypeID());

        assertFalse(roomTypeRepository.findById(saved.getRoomTypeID()).isPresent());
    }

    // 7
    @Test
    @Order(7)
    void testAddRoomType_HotelNotFound() {
        RoomTypeRequest dto = new RoomTypeRequest();
        dto.setHotelId(999999);
        dto.setRoomTypeName("Test");

        assertThrows(ResourceNotFoundException.class,
                () -> roomTypeService.addRoomType(dto));
    }

    // 8
    @Test
    @Order(8)
    void testGetRoomTypeById_NotFound() {
        assertThrows(ResourceNotFoundException.class,
                () -> roomTypeService.getRoomTypeById(hotel.getHotelID(), 999999));
    }

    // 9
    @Test
    @Order(9)
    void testGetRoomTypeById_Unauthorized() {
        RoomType saved = roomTypeRepository.save(
                new RoomType(null, "UnauthorizedTest", 2, hotel, 4, "X", 100f));

        assertThrows(UnauthorizedException.class,
                () -> roomTypeService.getRoomTypeById(9999, saved.getRoomTypeID()));
    }

    // 10
    @Test
    @Order(10)
    void testDeleteRoomType_NotFound() {
        assertThrows(ResourceNotFoundException.class,
                () -> roomTypeService.deleteRoomType(hotel.getHotelID(), -1));
    }

    // 11
    @Test
    @Order(11)
    void testDeleteRoomType_Unauthorized() {
        RoomType saved = roomTypeRepository.save(
                new RoomType(null, "DelFail", 2, hotel, 4, "D", 150f));

        assertThrows(UnauthorizedException.class,
                () -> roomTypeService.deleteRoomType(9999, saved.getRoomTypeID()));
    }

    // 12
    @Test
    @Order(12)
    void testGetRoomTypesByHotelId_HotelNotFound() {
        assertThrows(ResourceNotFoundException.class,
                () -> roomTypeService.getRoomTypesByHotelId(999999));
    }

    // 13
    @Test
    @Order(13)
    void testAddRoomType_WithNullOptionalFields() {
        RoomTypeRequest dto = new RoomTypeRequest();
        dto.setHotelId(hotel.getHotelID());
        dto.setRoomTypeName("NullFieldsTest");
        dto.setPrice(200f);
        dto.setQuantity(1);
        dto.setNumberOfGuests(2);

        RoomType saved = roomTypeService.addRoomType(dto);

        assertNotNull(saved);
        assertEquals("NullFieldsTest", saved.getRoomTypeName());
    }

    // 14
    @Test
    @Order(14)
    void testUpdateRoomType_UpdateAllFields() {
        RoomType saved = roomTypeRepository.save(
                new RoomType(null, "NameA", 2, hotel, 5, "DescA", 100f));

        RoomTypeRequest dto = new RoomTypeRequest();
        dto.setRoomTypeName("NameB");
        dto.setPrice(500f);
        dto.setDescription("DescB");
        dto.setQuantity(10);
        dto.setNumberOfGuests(4);

        RoomType updated = roomTypeService.updateRoomType(dto, saved.getRoomTypeID());

        assertEquals("NameB", updated.getRoomTypeName());
        assertEquals("DescB", updated.getDescription());
        assertEquals(10, updated.getQuantity());
    }

    // 15
    @Test
    @Order(15)
    void testGetRoomTypesByHotelId_EmptyList() {
        List<?> result = roomTypeService.getRoomTypesByHotelId(hotel.getHotelID());
        assertTrue(result.isEmpty());
    }
}

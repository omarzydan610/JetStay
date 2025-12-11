package com.example.backend.service.HotelService;

import com.example.backend.cache.RoomCacheManager;
import com.example.backend.dto.HotelDTO.RoomFilterDTO;
import com.example.backend.entity.Hotel;
import com.example.backend.entity.RoomType;
import com.example.backend.repository.RoomTypeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class RoomGraphQLServiceTest {

    private RoomCacheManager cacheManager;
    private RoomTypeRepository roomRepository;
    private RoomGraphQLService service;

    @BeforeEach
    void setup() {
        cacheManager = mock(RoomCacheManager.class);
        roomRepository = mock(RoomTypeRepository.class);
        service = new RoomGraphQLService(cacheManager);
    }

    private RoomType createRoom(Integer id, String name, float price, Hotel hotel) {
        RoomType r = new RoomType();
        r.setRoomTypeID(id);
        r.setRoomTypeName(name);
        r.setPrice(price);
        r.setHotel(hotel);
        return r;
    }

    private Hotel createHotel(Integer id, String name, String country, String city, float rate) {
        Hotel h = new Hotel();
        h.setHotelID(id);
        h.setHotelName(name);
        h.setCountry(country);
        h.setCity(city);
        h.setHotelRate(rate);
        h.setStatus(Hotel.Status.ACTIVE);
        return h;
    }

    @Test
    void testPaginationSinglePage() {
        RoomType r1 = createRoom(1, "Deluxe", 200, null);

        when(cacheManager.getRoomsPage("0_10")).thenReturn(null);
        when(roomRepository.findAll(PageRequest.of(0, 10)))
                .thenReturn(new PageImpl<>(List.of(r1)));

        List<RoomType> result = service.filterRooms(null, roomRepository, 0, 10);

        assertEquals(1, result.size());
        verify(cacheManager).putRoomsPage("0_10", List.of(r1));
    }

    @Test
    void testRoomNameFilter() {
        RoomType r1 = createRoom(1, "Deluxe", 200, null);
        RoomType r2 = createRoom(2, "Standard", 100, null);

        when(cacheManager.getRoomsPage("0_10")).thenReturn(null);
        when(roomRepository.findAll(PageRequest.of(0, 10)))
                .thenReturn(new PageImpl<>(List.of(r1, r2)));

        RoomFilterDTO filter = new RoomFilterDTO();
        filter.setRoomNameContains("del");

        List<RoomType> result = service.filterRooms(filter, roomRepository, 0, 10);

        assertEquals(1, result.size());
        assertEquals("Deluxe", result.get(0).getRoomTypeName());
    }

    @Test
    void testPriceFiltering() {
        RoomType r1 = createRoom(1, "Deluxe", 200, null);
        RoomType r2 = createRoom(2, "Standard", 80, null);

        when(cacheManager.getRoomsPage("0_10")).thenReturn(null);
        when(roomRepository.findAll(PageRequest.of(0, 10)))
                .thenReturn(new PageImpl<>(List.of(r1, r2)));

        RoomFilterDTO filter = new RoomFilterDTO();
        filter.setPriceGte(100F);
        filter.setPriceLte(250F);

        List<RoomType> result = service.filterRooms(filter, roomRepository, 0, 10);

        assertEquals(1, result.size());
        assertEquals("Deluxe", result.get(0).getRoomTypeName());
    }

    @Test
    void testHotelFilters() {
        Hotel h1 = createHotel(1, "Hilton", "Egypt", "Cairo", 4.5F);
        Hotel h2 = createHotel(2, "Marriott", "USA", "NY", 4.0F);

        RoomType r1 = createRoom(1, "Deluxe", 200, h1);
        RoomType r2 = createRoom(2, "Standard", 150, h2);

        when(cacheManager.getRoomsPage("0_10")).thenReturn(null);
        when(roomRepository.findAll(PageRequest.of(0, 10)))
                .thenReturn(new PageImpl<>(List.of(r1, r2)));

        RoomFilterDTO filter = new RoomFilterDTO();
        filter.setHotelNameContains("hil");
        filter.setCityContains("cai");
        filter.setCountryContains("eg");

        List<RoomType> result = service.filterRooms(filter, roomRepository, 0, 10);

        assertEquals(1, result.size());
        assertEquals("Deluxe", result.get(0).getRoomTypeName());
    }

    @Test
    void testRoomTypeContainsFilter() {
        RoomType r1 = createRoom(1, "Master Suite", 300, null);
        RoomType r2 = createRoom(2, "Budget Room", 50, null);

        when(cacheManager.getRoomsPage("0_10")).thenReturn(null);
        when(roomRepository.findAll(PageRequest.of(0, 10)))
                .thenReturn(new PageImpl<>(List.of(r1, r2)));

        RoomFilterDTO filter = new RoomFilterDTO();
        filter.setRoomNameContains("suite");

        List<RoomType> result = service.filterRooms(filter, roomRepository, 0, 10);

        assertEquals(1, result.size());
        assertEquals("Master Suite", result.get(0).getRoomTypeName());
    }


    @Test
    void testEmptyDatabase() {
        when(cacheManager.getRoomsPage("0_10")).thenReturn(null);
        when(roomRepository.findAll(PageRequest.of(0, 10)))
                .thenReturn(new PageImpl<>(List.of()));

        List<RoomType> result = service.filterRooms(null, roomRepository, 0, 10);

        assertEquals(0, result.size());
    }
}
package com.example.backend.service.HotelService;

import com.example.backend.cache.RoomCacheManager;
import com.example.backend.dto.HotelDTO.HotelFilterDTO;
import com.example.backend.entity.Hotel;
import com.example.backend.entity.RoomType;
import com.example.backend.repository.HotelRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class HotelGraphQLServiceTest {

    private RoomCacheManager cacheManager;
    private HotelRepository hotelRepository;
    private HotelGraphQLService service;

    @BeforeEach
    void setup() {
        cacheManager = mock(RoomCacheManager.class);
        hotelRepository = mock(HotelRepository.class);
        service = new HotelGraphQLService(cacheManager);
    }

    private Hotel createHotel(
            Integer id,
            String name,
            float rating,
            String country,
            String city,
            List<RoomType> roomTypes
    ) {
        Hotel hotel = new Hotel();
        hotel.setHotelID(id);
        hotel.setHotelName(name);
        hotel.setHotelRate(rating);
        hotel.setCountry(country);
        hotel.setCity(city);
        hotel.setRoomTypes(roomTypes);
        return hotel;
    }

    @Test
    void testPaginationSinglePage() {
        Hotel h1 = createHotel(1, "Hilton", 4.5F, "Egypt", "Cairo", List.of());

        when(cacheManager.getHotelsPage("0_10")).thenReturn(null);
        when(hotelRepository.findAll(PageRequest.of(0, 10)))
                .thenReturn(new PageImpl<>(List.of(h1)));

        List<Hotel> result = service.filterHotels(null, hotelRepository, 0, 10);

        assertEquals(1, result.size());
        verify(cacheManager).putHotelsPage("0_10", List.of(h1));
    }

    @Test
    void testCityAndCountryFilters() {
        Hotel h1 = createHotel(1, "Hilton", 4.5F, "Egypt", "Cairo", List.of());
        Hotel h2 = createHotel(2, "Marriott", 4.0F, "USA", "NY", List.of());

        when(cacheManager.getHotelsPage("0_10")).thenReturn(null);
        when(hotelRepository.findAll(PageRequest.of(0, 10)))
                .thenReturn(new PageImpl<>(List.of(h1, h2)));

        HotelFilterDTO filter = new HotelFilterDTO();
        filter.setCityContains("cai");
        filter.setCountryContains("eg");

        List<Hotel> result = service.filterHotels(filter, hotelRepository, 0, 10);

        assertEquals(1, result.size());
        assertEquals("Hilton", result.get(0).getHotelName());
    }

    @Test
    void testRatingFilter() {
        Hotel h1 = createHotel(1, "Hilton", 4.5F, "Egypt", "Cairo", List.of());
        Hotel h2 = createHotel(2, "Marriott", 3.5F, "USA", "NY", List.of());

        when(cacheManager.getHotelsPage("0_10")).thenReturn(null);
        when(hotelRepository.findAll(PageRequest.of(0, 10)))
                .thenReturn(new PageImpl<>(List.of(h1, h2)));

        HotelFilterDTO filter = new HotelFilterDTO();
        filter.setHotelRateGte(4.0F);

        List<Hotel> result = service.filterHotels(filter, hotelRepository, 0, 10);

        assertEquals(1, result.size());
        assertEquals("Hilton", result.get(0).getHotelName());
    }

    @Test
    void testRoomTypeFilters() {
        RoomType r1 = new RoomType();
        r1.setRoomTypeName("Single");
        r1.setPrice(100.0F);

        RoomType r2 = new RoomType();
        r2.setRoomTypeName("Double");
        r2.setPrice(200.0F);

        Hotel h = createHotel(1, "Hilton", 4.5F, "Egypt", "Cairo", List.of(r1, r2));

        when(cacheManager.getHotelsPage("0_10")).thenReturn(null);
        when(hotelRepository.findAll(PageRequest.of(0, 10)))
                .thenReturn(new PageImpl<>(List.of(h)));

        HotelFilterDTO filter = new HotelFilterDTO();
        filter.setRoomTypePriceGte(50.0F);
        filter.setRoomTypePriceLte(150.0F);

        List<Hotel> result = service.filterHotels(filter, hotelRepository, 0, 10);

        assertEquals(1, result.size());
    }

    @Test
    void testEmptyDatabase() {
        when(cacheManager.getHotelsPage("0_10")).thenReturn(null);
        when(hotelRepository.findAll(PageRequest.of(0, 10)))
                .thenReturn(new PageImpl<>(List.of()));

        List<Hotel> result = service.filterHotels(null, hotelRepository, 0, 10);

        assertEquals(0, result.size());
    }

    @Test
    void testRoomTypePriceFiltering() {
        // Create room types
        RoomType r1 = new RoomType();
        r1.setRoomTypeName("Single");
        r1.setPrice(100.0F);

        RoomType r2 = new RoomType();
        r2.setRoomTypeName("Double");
        r2.setPrice(200.0F);

        RoomType r3 = new RoomType();
        r3.setRoomTypeName("Suite");
        r3.setPrice(300.0F);

        // Create hotels with these room types
        Hotel h1 = createHotel(1, "Hotel A", 4.5F, "Egypt", "Cairo", List.of(r1, r2));
        Hotel h2 = createHotel(2, "Hotel B", 4.0F, "Egypt", "Cairo", List.of(r3));

        when(cacheManager.getHotelsPage("0_10")).thenReturn(null);
        when(hotelRepository.findAll(PageRequest.of(0, 10)))
                .thenReturn(new PageImpl<>(List.of(h1, h2)));

        // Filter: room price between 50 and 150
        HotelFilterDTO filter = new HotelFilterDTO();
        filter.setRoomTypePriceGte(50.0F);
        filter.setRoomTypePriceLte(150.0F);

        List<Hotel> result = service.filterHotels(filter, hotelRepository, 0, 10);

        // Only Hotel A should pass (has room priced 100)
        assertEquals(1, result.size());
        assertEquals("Hotel A", result.get(0).getHotelName());
    }

}
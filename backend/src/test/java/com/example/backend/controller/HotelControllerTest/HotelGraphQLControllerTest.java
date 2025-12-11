package com.example.backend.controller.HotelControllerTest;

import com.example.backend.controller.HotelController.HotelGraphQLController;
import com.example.backend.dto.HotelDTO.HotelFilterDTO;
import com.example.backend.entity.Hotel;
import com.example.backend.entity.User;
import com.example.backend.repository.HotelRepository;
import com.example.backend.service.HotelService.HotelGraphQLService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.graphql.GraphQlTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.graphql.test.tester.GraphQlTester;

import java.util.Arrays;
import java.util.List;

@GraphQlTest(HotelGraphQLController.class)
class HotelGraphQLControllerTest {

    @Autowired
    private GraphQlTester graphQlTester;

    @MockBean
    private HotelRepository hotelRepository;

    @MockBean
    private HotelGraphQLService hotelGraphQLService;

    @Test
    void testHotelsQuery() {

        Hotel hotel1 = new Hotel();
        hotel1.setHotelID(1);

        Hotel hotel2 = new Hotel();
        hotel2.setHotelID(2);

        List<Hotel> mockHotels = Arrays.asList(hotel1, hotel2);

        Mockito.when(hotelGraphQLService.filterHotels(
                Mockito.any(HotelFilterDTO.class),
                Mockito.eq(hotelRepository),
                Mockito.eq(0),
                Mockito.eq(10)
        )).thenReturn(mockHotels);

        graphQlTester.document("""
                query {
                  hotels(
                    filter: { hotelNameContains: "grand" }
                    page: 0,
                    size: 10
                  ) {
                    hotelID
                  }
                }
                """)
                .execute()
                .path("hotels")
                .entityList(Hotel.class)
                .hasSize(2);
    }

    @Test
    void testHotelsQuery_NoFilter() {

        Hotel hotel1 = new Hotel();
        hotel1.setHotelID(10);

        List<Hotel> mockHotels = List.of(hotel1);

        Mockito.when(hotelGraphQLService.filterHotels(
                Mockito.isNull(),
                Mockito.eq(hotelRepository),
                Mockito.eq(0),
                Mockito.eq(5)
        )).thenReturn(mockHotels);

        graphQlTester.document("""
                query {
                  hotels(
                    filter: null
                    page: 0,
                    size: 5
                  ) {
                    hotelID
                  }
                }
                """)
                .execute()
                .path("hotels")
                .entityList(Hotel.class)
                .hasSize(1);
    }

    @Test
    void testHotelsQuery_Pagination() {

        Mockito.when(hotelGraphQLService.filterHotels(
                Mockito.any(),
                Mockito.eq(hotelRepository),
                Mockito.eq(3),
                Mockito.eq(20)
        )).thenReturn(List.of());

        graphQlTester.document("""
                query {
                  hotels(
                    filter: { cityContains: "cairo" }
                    page: 3,
                    size: 20
                  ) {
                    hotelID
                  }
                }
                """)
                .execute()
                .path("hotels")
                .entityList(Hotel.class)
                .hasSize(0);
    }

    @Test
    void testHotelsQuery_FilterObjectPassedCorrectly() {

        Mockito.when(hotelGraphQLService.filterHotels(
                Mockito.any(),
                Mockito.eq(hotelRepository),
                Mockito.eq(0),
                Mockito.eq(10)
        )).thenAnswer(invocation -> {

            HotelFilterDTO filter = invocation.getArgument(0);

            assert filter.getHotelRateGte() == 4.5f;
            assert filter.getCityContains().equals("cairo");

            return List.of();
        });

        graphQlTester.document("""
                query {
                  hotels(
                    filter: { 
                      hotelRateGte: 4.5,
                      cityContains: "cairo"
                    }
                    page: 0,
                    size: 10
                  ) {
                    hotelID
                  }
                }
                """)
                .execute()
                .path("hotels")
                .entityList(Hotel.class)
                .hasSize(0);
    }

    @Test
    void testHotelsQuery_InvalidField_ShouldFail() {

        graphQlTester.document("""
                query {
                  hotels(
                    filter: { wrongField: "test" }
                    page: 0,
                    size: 10
                  ) {
                    hotelID
                  }
                }
                """)
                .execute()
                .errors()
                .satisfy(errors -> errors.get(0).getMessage().contains("wrongField")
                );
    }
}
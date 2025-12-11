package com.example.backend.controller.HotelControllerTest;

import com.example.backend.controller.HotelController.RoomGraphQLController;
import com.example.backend.dto.HotelDTO.RoomFilterDTO;
import com.example.backend.entity.RoomType;
import com.example.backend.repository.RoomTypeRepository;
import com.example.backend.service.HotelService.RoomGraphQLService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.graphql.GraphQlTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.graphql.test.tester.GraphQlTester;

import java.util.Arrays;
import java.util.List;

@GraphQlTest(RoomGraphQLController.class)
class RoomGraphQLControllerTest {

    @Autowired
    private GraphQlTester graphQlTester;

    @MockBean
    private RoomTypeRepository roomRepository;

    @MockBean
    private RoomGraphQLService roomGraphQLService;

    @Test
    void testRoomsQuery() {

        RoomType r1 = new RoomType();
        r1.setRoomTypeID(1);

        RoomType r2 = new RoomType();
        r2.setRoomTypeID(2);

        List<RoomType> mockRooms = Arrays.asList(r1, r2);

        Mockito.when(roomGraphQLService.filterRooms(
                Mockito.any(RoomFilterDTO.class),
                Mockito.eq(roomRepository),
                Mockito.eq(0),
                Mockito.eq(10)
        )).thenReturn(mockRooms);

        graphQlTester.document("""
                query {
                  rooms(
                    filter: { roomTypeContains: "deluxe" }
                    page: 0,
                    size: 10
                  ) {
                    roomTypeID
                  }
                }
                """)
                .execute()
                .path("rooms")
                .entityList(RoomType.class)
                .hasSize(2);
    }

    @Test
    void testRoomsQuery_NoFilter() {

        RoomType r = new RoomType();
        r.setRoomTypeID(5);

        List<RoomType> mockRooms = List.of(r);

        Mockito.when(roomGraphQLService.filterRooms(
                Mockito.isNull(),
                Mockito.eq(roomRepository),
                Mockito.eq(0),
                Mockito.eq(5)
        )).thenReturn(mockRooms);

        graphQlTester.document("""
                query {
                  rooms(
                    filter: null
                    page: 0,
                    size: 5
                  ) {
                    roomTypeID
                  }
                }
                """)
                .execute()
                .path("rooms")
                .entityList(RoomType.class)
                .hasSize(1);
    }

    @Test
    void testRoomsQuery_Pagination() {

        Mockito.when(roomGraphQLService.filterRooms(
                Mockito.any(),
                Mockito.eq(roomRepository),
                Mockito.eq(2),
                Mockito.eq(15)
        )).thenReturn(List.of());

        graphQlTester.document("""
                query {
                  rooms(
                    page: 2,
                    size: 15
                  ) {
                    roomTypeID
                  }
                }
                """)
                .execute()
                .path("rooms")
                .entityList(RoomType.class)
                .hasSize(0);
    }

    @Test
    void testRoomsQuery_FilterObjectPassedCorrectly() {

        Mockito.when(roomGraphQLService.filterRooms(
                Mockito.any(),
                Mockito.eq(roomRepository),
                Mockito.eq(0),
                Mockito.eq(10)
        )).thenAnswer(invocation -> {

            RoomFilterDTO filter = invocation.getArgument(0);

            assert filter.getPriceLte() == 300.0;
            assert filter.getRoomTypeContains().equals("suite");

            return List.of();
        });

        graphQlTester.document("""
                query {
                  rooms(
                    filter: { 
                      priceLte: 300,
                      roomTypeContains: "suite"
                    }
                    page: 0,
                    size: 10
                  ) {
                    roomTypeID
                  }
                }
                """)
                .execute()
                .path("rooms")
                .entityList(RoomType.class)
                .hasSize(0);
    }

    @Test
    void testRoomsQuery_InvalidField_ShouldFail() {

        graphQlTester.document("""
                query {
                  rooms(
                    filter: { wrongField: "x" }
                    page: 0,
                    size: 10
                  ) {
                    roomTypeID
                  }
                }
                """)
                .execute()
                .errors()
                .satisfy(errors -> errors.get(0).getMessage().contains("wrongField"));
    }
}
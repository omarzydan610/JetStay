package com.example.backend.controller.FlightControllerTest;

import com.example.backend.controller.AirlineController.FlightGraphQLController;
import com.example.backend.dto.AirlineDTO.FlightFilterDTO;
import com.example.backend.entity.Flight;
import com.example.backend.repository.FlightRepository;
import com.example.backend.service.AirlineService.FlightGraphQLService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.graphql.GraphQlTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.graphql.test.tester.GraphQlTester;

import java.util.Arrays;
import java.util.List;

@GraphQlTest(FlightGraphQLController.class)
class FlightGraphQLControllerTest {

    @Autowired
    private GraphQlTester graphQlTester;

    @MockBean
    private FlightRepository flightRepository;

    @MockBean
    private FlightGraphQLService flightGraphQLService;

    @Test
    void testFlightsQuery() {

        Flight flight1 = new Flight();
        flight1.setFlightID(1);

        Flight flight2 = new Flight();
        flight2.setFlightID(2);

        List<Flight> mockFlights = Arrays.asList(flight1, flight2);

        Mockito.when(flightGraphQLService.filterFlights(
                Mockito.any(FlightFilterDTO.class),
                Mockito.eq(flightRepository),
                Mockito.eq(0),
                Mockito.eq(10)
        )).thenReturn(mockFlights);

        graphQlTester.document("""
                query {
                  flights(
                    filter: { airlineNameContains: "air" }
                    page: 0,
                    size: 10
                  ) {
                    flightID
                  }
                }
                """)
                .execute()
                .path("flights")
                .entityList(Flight.class)
                .hasSize(2);
    }

    @Test
    void testFlightsQuery_NoFilter() {

        Flight flight1 = new Flight();
        flight1.setFlightID(10);

        List<Flight> mockFlights = List.of(flight1);

        Mockito.when(flightGraphQLService.filterFlights(
                Mockito.isNull(),
                Mockito.eq(flightRepository),
                Mockito.eq(0),
                Mockito.eq(5)
        )).thenReturn(mockFlights);

        graphQlTester.document("""
                query {
                  flights(
                    filter: null
                    page: 0,
                    size: 5
                  ) {
                    flightID
                  }
                }
                """)
                .execute()
                .path("flights")
                .entityList(Flight.class)
                .hasSize(1);
    }

    @Test
    void testFlightsQuery_Pagination() {

        Mockito.when(flightGraphQLService.filterFlights(
                Mockito.any(),
                Mockito.eq(flightRepository),
                Mockito.eq(3),
                Mockito.eq(20)
        )).thenReturn(List.of());

        graphQlTester.document("""
                query {
                  flights(
                    filter: { airlineNationalityContains: "egypt" }
                    page: 3,
                    size: 20
                  ) {
                    flightID
                  }
                }
                """)
                .execute()
                .path("flights")
                .entityList(Flight.class)
                .hasSize(0);
    }

    @Test
    void testFlightsQuery_FilterObjectPassedCorrectly() {

        Mockito.when(flightGraphQLService.filterFlights(
                Mockito.any(),
                Mockito.eq(flightRepository),
                Mockito.eq(0),
                Mockito.eq(10)
        )).thenAnswer(invocation -> {

            FlightFilterDTO filter = invocation.getArgument(0);

            assert filter.getAirlineRatingGte() == 4.5f;
            assert filter.getDepartureCityContains().equals("cairo");

            return List.of();
        });

        graphQlTester.document("""
                query {
                  flights(
                    filter: { 
                      airlineRatingGte: 4.5,
                      departureCityContains: "cairo"
                    }
                    page: 0,
                    size: 10
                  ) {
                    flightID
                  }
                }
                """)
                .execute()
                .path("flights")
                .entityList(Flight.class)
                .hasSize(0);
    }

    @Test
    void testFlightsQuery_InvalidField_ShouldFail() {

        graphQlTester.document("""
                query {
                  flights(
                    filter: { wrongField: "test" }
                    page: 0,
                    size: 10
                  ) {
                    flightID
                  }
                }
                """)
                .execute()
                .errors()
                .satisfy(errors -> errors.get(0).getMessage().contains("wrongField")
                );
    }
}
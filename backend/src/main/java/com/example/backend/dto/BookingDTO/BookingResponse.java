package com.example.backend.dto.BookingDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponse {
    private String type; // "HOTEL" or "FLIGHT"
    private HotelBooking hotelBooking;
    private FlightBooking flightBooking;

    // ===================== HOTEL BOOKING =====================
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class HotelBooking {
        private Integer bookingId;
        private String status;
        private Float totalPrice;
        private LocalDate createdAt;
        private LocalDate checkInDate;
        private LocalDate checkOutDate;
        private Integer numberOfGuests;
        
        private RoomInfo room;
        private HotelInfo hotel;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RoomInfo {
        private String type; // roomTypeName
        private Integer capacity; // numberOfGuests from roomType
        private Float price;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class HotelInfo {
        private Integer id;
        private String name;
        private String city;
        private String country;
    }

    // ===================== FLIGHT BOOKING =====================
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FlightBooking {
        private Integer ticketId;
        private Boolean isPaid;
        private LocalDate createdAt;
        private LocalDate flightDate;
        private Float totalPrice;
        
        private TripInfo trip;
        private FlightInfo flight;
        private AirlineInfo airline;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TripInfo {
        private String type; // tripType.typeName (e.g., "ECONOMY", "BUSINESS")
        private Float price;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FlightInfo {
        private Integer id;
        private String departureAirport; // airport name
        private String arrivalAirport; // airport name
        private String departureCity; // departure airport city
        private String arrivalCity; // arrival airport city
        private LocalDateTime departureDate;
        private LocalDateTime arrivalDate;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AirlineInfo {
        private Integer id;
        private String name;
        private String nationality;
    }
}

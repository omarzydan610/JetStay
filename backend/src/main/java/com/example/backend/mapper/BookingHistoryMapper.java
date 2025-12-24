package com.example.backend.mapper;

import com.example.backend.dto.BookingDTO.BookingResponse;
import com.example.backend.entity.RoomBooking;
import com.example.backend.entity.FlightTicket;

public class BookingHistoryMapper {

    /**
     * Map RoomBooking entity to BookingResponse for hotel bookings
     */
    public static BookingResponse mapHotelBookingToResponse(RoomBooking roomBooking) {
        BookingResponse response = new BookingResponse();
        response.setType("HOTEL");

        // Hotel booking details
        BookingResponse.HotelBooking hotelBooking = new BookingResponse.HotelBooking();
        hotelBooking.setBookingId(roomBooking.getBookingId());
        hotelBooking.setStatus(roomBooking.getBookingTransaction().getStatus().name());
        hotelBooking.setTotalPrice(roomBooking.getBookingTransaction().getTotalPrice());
        hotelBooking.setCreatedAt(roomBooking.getBookingTransaction().getBookingDate());
        hotelBooking.setCheckInDate(roomBooking.getCheckIn());
        hotelBooking.setCheckOutDate(roomBooking.getCheckOut());
        hotelBooking.setNumberOfGuests(roomBooking.getBookingTransaction().getNumberOfGuests());

        // Room info
        BookingResponse.RoomInfo roomInfo = new BookingResponse.RoomInfo();
        roomInfo.setType(roomBooking.getRoomType().getRoomTypeName());
        roomInfo.setCapacity(roomBooking.getRoomType().getNumberOfGuests());
        roomInfo.setPrice(roomBooking.getRoomType().getPrice());
        hotelBooking.setRoom(roomInfo);

        // Hotel info
        BookingResponse.HotelInfo hotelInfo = new BookingResponse.HotelInfo();
        hotelInfo.setId(roomBooking.getHotel().getHotelID());
        hotelInfo.setName(roomBooking.getHotel().getHotelName());
        hotelInfo.setCity(roomBooking.getHotel().getCity());
        hotelInfo.setCountry(roomBooking.getHotel().getCountry());
        hotelBooking.setHotel(hotelInfo);

        response.setHotelBooking(hotelBooking);
        return response;
    }

    /**
     * Map FlightTicket entity to BookingResponse for flight bookings
     */
    public static BookingResponse mapFlightBookingToResponse(FlightTicket flightTicket) {
        BookingResponse response = new BookingResponse();
        response.setType("FLIGHT");

        // Flight booking details
        BookingResponse.FlightBooking flightBooking = new BookingResponse.FlightBooking();
        flightBooking.setTicketId(flightTicket.getTicketId());
        flightBooking.setIsPaid(flightTicket.getIsPaid());
        flightBooking.setCreatedAt(flightTicket.getCreatedAt());
        flightBooking.setFlightDate(flightTicket.getFlightDate());
        flightBooking.setTotalPrice(flightTicket.getPrice());

        // Trip info
        BookingResponse.TripInfo tripInfo = new BookingResponse.TripInfo();
        tripInfo.setType(flightTicket.getTripType().getTypeName());
        tripInfo.setPrice(flightTicket.getTripType().getPrice().floatValue());
        flightBooking.setTrip(tripInfo);

        // Flight info
        BookingResponse.FlightInfo flightInfo = new BookingResponse.FlightInfo();
        flightInfo.setId(flightTicket.getFlight().getFlightID());
        flightInfo.setDepartureAirport(flightTicket.getFlight().getDepartureAirport().getAirportName());
        flightInfo.setArrivalAirport(flightTicket.getFlight().getArrivalAirport().getAirportName());
        flightInfo.setDepartureCity(flightTicket.getFlight().getDepartureAirport().getCity());
        flightInfo.setArrivalCity(flightTicket.getFlight().getArrivalAirport().getCity());
        flightInfo.setDepartureDate(flightTicket.getFlight().getDepartureDate());
        flightInfo.setArrivalDate(flightTicket.getFlight().getArrivalDate());
        flightBooking.setFlight(flightInfo);

        // Airline info
        BookingResponse.AirlineInfo airlineInfo = new BookingResponse.AirlineInfo();
        airlineInfo.setId(flightTicket.getFlight().getAirline().getAirlineID());
        airlineInfo.setName(flightTicket.getFlight().getAirline().getAirlineName());
        airlineInfo.setNationality(flightTicket.getFlight().getAirline().getAirlineNationality());
        flightBooking.setAirline(airlineInfo);

        response.setFlightBooking(flightBooking);
        return response;
    }
}

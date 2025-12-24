package com.example.backend.service.BookingHistoryService;

import com.example.backend.dto.BookingDTO.BookingResponse;
import com.example.backend.entity.FlightTicket;
import com.example.backend.entity.RoomBooking;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.mapper.BookingHistoryMapper;
import com.example.backend.repository.FlightTicketRepository;
import com.example.backend.repository.RoomBookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingHistoryService {

    @Autowired
    private RoomBookingRepository roomBookingRepository;

    @Autowired
    private FlightTicketRepository flightTicketRepository;

    public List<BookingResponse> getBookingHistory(Integer userId) {
        List<BookingResponse> history = new ArrayList<>();

        // Get past hotel bookings history
        List<RoomBooking> hotelBookings = roomBookingRepository.findPastBookingsByUserId(userId);
        List<BookingResponse> hotelResponses = hotelBookings.stream()
                .map(BookingHistoryMapper::mapHotelBookingToResponse)
                .collect(Collectors.toList());
        history.addAll(hotelResponses);

        // Get past flight bookings history
        List<FlightTicket> flightBookings = flightTicketRepository.findPastFlightsByUserId(userId);
        List<BookingResponse> flightResponses = flightBookings.stream()
                .map(BookingHistoryMapper::mapFlightBookingToResponse)
                .collect(Collectors.toList());
        history.addAll(flightResponses);

        return history;
    }

    public List<BookingResponse> getUpcomingBookings(Integer userId) {
        List<BookingResponse> upcoming = new ArrayList<>();

        // Get upcoming hotel bookings
        List<RoomBooking> upcomingHotels = roomBookingRepository.findUpcomingBookingsByUserId(userId);
        List<BookingResponse> hotelResponses = upcomingHotels.stream()
                .map(BookingHistoryMapper::mapHotelBookingToResponse)
                .collect(Collectors.toList());
        upcoming.addAll(hotelResponses);

        // Get upcoming flight bookings
        List<FlightTicket> upcomingFlights = flightTicketRepository.findUpcomingFlightsByUserId(userId);
        List<BookingResponse> flightResponses = upcomingFlights.stream()
                .map(BookingHistoryMapper::mapFlightBookingToResponse)
                .collect(Collectors.toList());
        upcoming.addAll(flightResponses);

        return upcoming;
    }

    public BookingResponse getBookingDetails(Integer bookingId) {
        // Try to find as hotel booking first
        try {
            RoomBooking roomBooking = roomBookingRepository.findById(bookingId)
                    .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
            return BookingHistoryMapper.mapHotelBookingToResponse(roomBooking);
        } catch (ResourceNotFoundException e) {
            // If not found as hotel, try as flight ticket
            FlightTicket flightTicket = flightTicketRepository.findById(bookingId)
                    .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
            return BookingHistoryMapper.mapFlightBookingToResponse(flightTicket);
        }
    }
}

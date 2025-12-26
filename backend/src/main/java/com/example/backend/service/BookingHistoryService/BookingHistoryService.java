package com.example.backend.service.BookingHistoryService;

import com.example.backend.dto.BookingDTOs.FlightTicketResponse;
import com.example.backend.dto.BookingDTOs.HotelBookingResponse;
import com.example.backend.entity.BookingTransaction;
import com.example.backend.entity.FlightTicket;
import com.example.backend.entity.RoomBooking;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.mapper.BookingHistoryMapper;
import com.example.backend.repository.BookingTransactionRepository;
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
    private BookingTransactionRepository bookingTransactionRepository;

    @Autowired
    private FlightTicketRepository flightTicketRepository;

    // ==================== Hotel Booking Methods ====================

    public List<HotelBookingResponse> getBookingHistory(Integer userId) {
        List<HotelBookingResponse> history = new ArrayList<>();

        // Get past booking transactions for the user
        List<BookingTransaction> transactions = bookingTransactionRepository.findPastBookingsByUserId(userId);
        // For each transaction, get associated room bookings and map to response
        for (BookingTransaction transaction : transactions) {
            List<RoomBooking> roomBookings = roomBookingRepository.findByBookingTransactionId(
                    transaction.getBookingTransactionId());

            HotelBookingResponse response = BookingHistoryMapper.mapToHotelBookingResponse(transaction, roomBookings);
            if (response != null) {
                history.add(response);
            }
        }

        return history;
    }

    public List<HotelBookingResponse> getUpcomingBookings(Integer userId) {
        List<HotelBookingResponse> upcoming = new ArrayList<>();
        
        // Get upcoming booking transactions for the user
        List<BookingTransaction> transactions = bookingTransactionRepository.findUpcomingBookingsByUserId(userId);

        // For each transaction, get associated room bookings and map to response
        for (BookingTransaction transaction : transactions) {
            List<RoomBooking> roomBookings = roomBookingRepository.findByBookingTransactionId(
                    transaction.getBookingTransactionId());

            HotelBookingResponse response = BookingHistoryMapper.mapToHotelBookingResponse(transaction, roomBookings);
            if (response != null) {
                upcoming.add(response);
            }
        }

        return upcoming;
    }

    public HotelBookingResponse getBookingDetails(Integer bookingTransactionId) {
        // Find the booking transaction
        BookingTransaction transaction = bookingTransactionRepository.findById(bookingTransactionId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Booking transaction not found with id: " + bookingTransactionId));

        // Get associated room bookings
        List<RoomBooking> roomBookings = roomBookingRepository.findByBookingTransactionId(bookingTransactionId);

        return BookingHistoryMapper.mapToHotelBookingResponse(transaction, roomBookings);
    }

    // ==================== Flight Ticket Methods ====================

    public List<FlightTicketResponse> getFlightTicketHistory(Integer userId) {
        List<FlightTicket> tickets = flightTicketRepository.findPastFlightsByUserId(userId);
        return tickets.stream()
                .map(FlightTicketResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public List<FlightTicketResponse> getUpcomingFlightTickets(Integer userId) {
        List<FlightTicket> tickets = flightTicketRepository.findUpcomingFlightsByUserId(userId);
        return tickets.stream()
                .map(FlightTicketResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public FlightTicketResponse getFlightTicketDetails(Integer ticketId) {
        FlightTicket ticket = flightTicketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Flight ticket not found with id: " + ticketId));
        return FlightTicketResponse.fromEntity(ticket);
    }
}

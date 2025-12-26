package com.example.backend.mapper;

import com.example.backend.entity.RoomBooking;
import com.example.backend.entity.BookingTransaction;
import com.example.backend.dto.BookingDTOs.HotelBookingResponse;
import com.example.backend.dto.BookingDTOs.HotelBookingResponse.RoomBookingResponse;

import java.util.List;
import java.util.stream.Collectors;

public class BookingHistoryMapper {

    /**
     * Map BookingTransaction with associated RoomBookings to HotelBookingResponse
     * 
     * @param bookingTransaction The booking transaction entity
     * @param roomBookings       List of room bookings associated with this
     *                           transaction
     * @return HotelBookingResponse with transaction details and room booking
     *         details
     */
    public static HotelBookingResponse mapToHotelBookingResponse(
            BookingTransaction bookingTransaction,
            List<RoomBooking> roomBookings) {

        if (bookingTransaction == null) {
            return null;
        }

        HotelBookingResponse response = new HotelBookingResponse();
        response.setBookingTransaction(bookingTransaction);

        // Map room bookings to RoomBookingResponse
        if (roomBookings != null && !roomBookings.isEmpty()) {
            List<RoomBookingResponse> roomBookingResponses = roomBookings.stream()
                    .map(rb -> {
                        RoomBookingResponse rbResponse = response.new RoomBookingResponse();
                        if (rb.getRoomType() != null) {
                            rbResponse.setRoomType(rb.getRoomType().getRoomTypeName());
                            rbResponse.setPrice(rb.getRoomType().getPrice());
                        }
                        rbResponse.setNoOfRooms(rb.getNoOfRooms());
                        return rbResponse;
                    })
                    .collect(Collectors.toList());

            response.setRoomBooking(roomBookingResponses);
        }

        return response;
    }
}

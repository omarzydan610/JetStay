package com.example.backend.controller.AdminController;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.dto.AdminDTO.BookingMonitoringResponse;
import com.example.backend.dto.AdminDTO.FlightMonitoringResponse;
import com.example.backend.dto.AdminDTO.PartnerShipNameResponse;
import com.example.backend.dto.response.SuccessResponse;
import com.example.backend.entity.BookingTransaction;
import com.example.backend.entity.FlightTicket;
import com.example.backend.service.AdminService.AdminMonitorFlight;
import com.example.backend.service.AdminService.AdminService;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    AdminService adminService;

    @Autowired
    AdminMonitorFlight adminMonitorFlight;

    @GetMapping("/monitor-bookings")
    public ResponseEntity<SuccessResponse<BookingMonitoringResponse>> monitorBookings(
            @RequestParam("startDate") String startDate,
            @RequestParam("endDate") String endDate,
            @RequestParam(value = "hotelId", defaultValue = "0") Long hotelId) {

        LocalDate start = LocalDate.parse(startDate);
        LocalDate end = LocalDate.parse(endDate);

        BookingMonitoringResponse response = adminService.monitorBookings(start, end, hotelId);
        return ResponseEntity.ok(SuccessResponse.of("Booking monitoring data retrieved successfully", response));
    }

    @GetMapping("/monitor-flights")
    public ResponseEntity<SuccessResponse<FlightMonitoringResponse>> monitorFlights(
            @RequestParam("startDate") String startDate,
            @RequestParam("endDate") String endDate,
            @RequestParam(value = "airlineId", defaultValue = "0") Long airlineId) {

        LocalDate start = LocalDate.parse(startDate);
        LocalDate end = LocalDate.parse(endDate);

        FlightMonitoringResponse response = adminMonitorFlight.monitorFlightTransactions(start, end, airlineId);
        return ResponseEntity.ok(SuccessResponse.of("Flight monitoring data retrieved successfully", response));
    }

    @GetMapping("/Tickets-details")
    public List<FlightTicket> getTicketsDetail(
            @RequestParam("startDate") String startDate,
            @RequestParam("endDate") String endDate,
            @RequestParam(value = "airlineId", defaultValue = "0") Long airlineId) {
        LocalDate start = LocalDate.parse(startDate);
        LocalDate end = LocalDate.parse(endDate);
        return adminMonitorFlight.getTicketDetails(start, end, airlineId);
    }

    @GetMapping("/Booking-details")
    public List<BookingTransaction> getBookingDetail(
            @RequestParam("startDate") String startDate,
            @RequestParam("endDate") String endDate,
            @RequestParam(value = "hotelId", defaultValue = "0") Long airlineId) {
        LocalDate start = LocalDate.parse(startDate);
        LocalDate end = LocalDate.parse(endDate);
        return adminService.geBookingDetails(start, end, airlineId);
    }

    @GetMapping("/hotels")
    public ResponseEntity<SuccessResponse<List<PartnerShipNameResponse>>> getAllHotels() {
        return ResponseEntity.ok(SuccessResponse.of("Hotels retrieved successfully", adminService.getAllHotels()));
    }

    @GetMapping("/airlines")
    public ResponseEntity<SuccessResponse<List<PartnerShipNameResponse>>> getAllAirlines() {
        return ResponseEntity.ok(SuccessResponse.of("Airlines retrieved successfully", adminService.getAllAirlines()));
    }

}

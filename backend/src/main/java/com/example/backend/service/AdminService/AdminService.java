package com.example.backend.service.AdminService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.dto.AdminDTO.BookingMonitoringResponse;
import com.example.backend.dto.AdminDTO.FlightMonitoringResponse;
import com.example.backend.dto.AdminDTO.PartnerShipNameResponse;
import com.example.backend.dto.AdminDTO.DatabaseDTO.CountByStateDTO;
import com.example.backend.repository.AirlineRepository;
import com.example.backend.repository.BookingTransactionRepository;
import com.example.backend.repository.FlightTicketRepository;
import com.example.backend.repository.HotelRepository;
import com.example.backend.repository.TicketPaymentRepository;

import java.time.LocalDate;
import java.util.*;

@Service
public class AdminService {

    @Autowired
    private BookingTransactionRepository bookingTransactionRepository;

    @Autowired
    private FlightTicketRepository flightTicketRepository;

    @Autowired
    private TicketPaymentRepository ticketPaymentRepository;

    @Autowired
    private AirlineRepository airlineRepository;

    @Autowired
    private HotelRepository hotelRepository;

   
    public BookingMonitoringResponse monitorBookings(LocalDate startDate, LocalDate endDate, long hotelId) {
        // Fetch aggregated booking statistics (with optional hotel filtering)
        Object[] bookingStats = getBookingStats(startDate, endDate, hotelId);

        Integer totalBookings = ((Long) bookingStats[0]).intValue();
        Double totalRevenue = bookingStats[1] != null ? (Double) bookingStats[1] : 0.0;
        Double totalGuests = bookingStats[2] != null ? ((Long) bookingStats[2]).doubleValue() : 0.0;
        Double totalRooms = bookingStats[3] != null ? ((Long) bookingStats[3]).doubleValue() : 0.0;

        
        List<CountByStateDTO> bookingStatusList = getBookingStatusList(startDate, endDate, hotelId);

        List<BookingMonitoringResponse.HotelBookingStats> bookingsByHotel = getBookingsByHotel(startDate, endDate,
                hotelId);

        List<BookingMonitoringResponse.DailyBookingStats> dailyBookings = getDailyBookings(startDate, endDate, hotelId);

        List<BookingMonitoringResponse.PaymentMethodStats> bookingsByPaymentMethod = getBookingsByPaymentMethod(
                startDate, endDate, hotelId);

        Map<String, Integer> bookingsByPaymentStatus = getBookingsByPaymentStatus(startDate, endDate, hotelId);

        Map<String, Integer> bookingsByStatus = getBookingsByStatus(bookingStatusList);

        return buildTheResponse(totalBookings, totalRevenue, totalGuests, totalRooms, bookingsByHotel, dailyBookings,
                bookingsByPaymentMethod, bookingsByPaymentStatus, bookingsByStatus);
    }

    private BookingMonitoringResponse buildTheResponse(Integer totalBookings, Double totalRevenue, Double totalGuests,
            Double totalRooms, List<BookingMonitoringResponse.HotelBookingStats> bookingsByHotel,
            List<BookingMonitoringResponse.DailyBookingStats> dailyBookings,
            List<BookingMonitoringResponse.PaymentMethodStats> bookingsByPaymentMethod,
            Map<String, Integer> bookingsByPaymentStatus, Map<String, Integer> bookingsByStatus) {
        return BookingMonitoringResponse.builder()
                .totalBookings(totalBookings)
                .totalRevenue(totalRevenue)
                .totalGuests(totalGuests)
                .totalRoomsBooked(totalRooms)
                .bookingsByStatus(bookingsByStatus)
                .bookingsByPaymentStatus(bookingsByPaymentStatus)
                .bookingsByHotel(bookingsByHotel)
                .dailyBookings(dailyBookings)
                .bookingsByPaymentMethod(bookingsByPaymentMethod)
                .build();
    }

    private Map<String, Integer> getBookingsByStatus(List<CountByStateDTO> bookingStatusList) {
        Map<String, Integer> bookingsByStatus = bookingStatusList.stream()
                .collect(java.util.stream.Collectors.toMap(
                        dto -> dto.getStatus().toString(),
                        dto -> dto.getCount().intValue()
                ));
        return bookingsByStatus;
    }

    private Map<String, Integer> getBookingsByPaymentStatus(LocalDate startDate, LocalDate endDate, long hotelId) {
        List<Object[]> paymentStatusList = (hotelId == 0)
                ? bookingTransactionRepository.getBookingCountsByPaymentStatusBetweenDate(startDate, endDate)
                : bookingTransactionRepository.getBookingCountsByPaymentStatusBetweenDateAndHotel(startDate, endDate, hotelId);

        Map<String, Integer> bookingsByPaymentStatus = new HashMap<>();
        for (Object[] row : paymentStatusList) {
            Boolean isPaid = (Boolean) row[0];
            Long count = (Long) row[1];
            bookingsByPaymentStatus.put(isPaid ? "paid" : "unpaid", count.intValue());
        }
        return bookingsByPaymentStatus;
    }

    private List<BookingMonitoringResponse.PaymentMethodStats> getBookingsByPaymentMethod(LocalDate startDate,
            LocalDate endDate, long hotelId) {
        List<Object[]> paymentMethodList = (hotelId == 0)
                ? bookingTransactionRepository.getBookingCountsAndRevenueByPaymentMethod(startDate, endDate)
                : bookingTransactionRepository.getBookingCountsAndRevenueByPaymentMethodAndHotel(startDate, endDate, hotelId);

        List<BookingMonitoringResponse.PaymentMethodStats> bookingsByPaymentMethod = new ArrayList<>();
        for (Object[] row : paymentMethodList) {
            bookingsByPaymentMethod.add(BookingMonitoringResponse.PaymentMethodStats.builder()
                    .methodId((Integer) row[0])
                    .methodName((String) row[1])
                    .count(((Long) row[2]).intValue())
                    .totalAmount((Double) row[3])
                    .build());
        }
        return bookingsByPaymentMethod;
    }

    private List<BookingMonitoringResponse.DailyBookingStats> getDailyBookings(LocalDate startDate, LocalDate endDate,
            long hotelId) {
        List<Object[]> dailyStatsList = (hotelId == 0)
                ? bookingTransactionRepository.getDailyBookingSummary(startDate, endDate)
                : bookingTransactionRepository.getDailyBookingSummaryByHotel(startDate, endDate, hotelId);

        List<BookingMonitoringResponse.DailyBookingStats> dailyBookings = new ArrayList<>();
        for (Object[] row : dailyStatsList) {
            dailyBookings.add(BookingMonitoringResponse.DailyBookingStats.builder()
                    .date(row[0].toString())
                    .totalBookings(((Long) row[1]).intValue())
                    .totalRevenue((Double) row[2])
                    .build());
        }
        return dailyBookings;
    }

    private List<BookingMonitoringResponse.HotelBookingStats> getBookingsByHotel(LocalDate startDate, LocalDate endDate,
            long hotelId) {
        List<Object[]> hotelStatsList = (hotelId == 0)
                ? bookingTransactionRepository.getBookingCountsAndRevenueByHotelBetweenDate(startDate, endDate)
                : bookingTransactionRepository.getBookingCountsAndRevenueByHotelBetweenDateAndHotel(startDate, endDate, hotelId);

        List<BookingMonitoringResponse.HotelBookingStats> bookingsByHotel = new ArrayList<>();
        for (Object[] row : hotelStatsList) {
            bookingsByHotel.add(BookingMonitoringResponse.HotelBookingStats.builder()
                    .hotelId((Integer) row[0])
                    .hotelName((String) row[1])
                    .totalBookings(((Long) row[2]).intValue())
                    .totalRevenue((Double) row[3])
                    .build());
        }
        return bookingsByHotel;
    }

    private List<CountByStateDTO> getBookingStatusList(LocalDate startDate, LocalDate endDate, long hotelId) {
        List<CountByStateDTO> bookingStatusList = (hotelId == 0)
                ? bookingTransactionRepository.getBookingCountsByStatusBetweenDate(startDate, endDate)
                : bookingTransactionRepository.getBookingCountsByStatusBetweenDateAndHotel(startDate, endDate, hotelId);
        return bookingStatusList;
    }

    private Object[] getBookingStats(LocalDate startDate, LocalDate endDate, long hotelId) {
        List<Object[]> result = (hotelId == 0)
                ? bookingTransactionRepository.getTotalBookingsCountBetweenDate(startDate, endDate)
                : bookingTransactionRepository.getTotalBookingsCountBetweenDateAndHotel(startDate, endDate, hotelId);
        return result.isEmpty() ? new Object[]{0L, 0.0, 0L, 0L} : result.get(0);
    }

   
    public FlightMonitoringResponse monitorFlightTransactions(LocalDate startDate, LocalDate endDate, long airlineId) {
        // Fetch aggregated ticket statistics (with optional airline filtering)
        List<Object[]> ticketStats = (airlineId == 0)
                ? flightTicketRepository.getTotalTicketsCountBetweenDate(startDate, endDate)
                : flightTicketRepository.getTotalTicketsCountBetweenDateAndAirline(startDate, endDate, airlineId);
        Object[] object = ticketStats.get(0);
        Integer totalTickets = ((Long) object[0]).intValue();
        Double totalRevenue = (Double) object[1];

        // Fetch ticket payment status breakdown (paid/unpaid) (with optional airline filtering)
        Map<String, Integer> ticketsByPaymentStatus = getTicketsByPaymentStatus(startDate, endDate, airlineId);

        // Fetch tickets by airline (with optional airline filtering)
        List<FlightMonitoringResponse.AirlineTicketStats> ticketsByAirline = getTicketsByAirline(startDate, endDate,
                airlineId);

        // Fetch flight status breakdown (with optional airline filtering)
        Map<String, Integer> flightsByStatus = getFlightsByStatus(startDate, endDate, airlineId);

        // Fetch payment status breakdown (with optional airline filtering)
        Map<String, Integer> paymentsByStatus = getPaymentsByStatus(startDate, endDate, airlineId);

        // Fetch payments by method (with optional airline filtering)
        List<FlightMonitoringResponse.PaymentMethodStats> paymentsByMethod = getPaymentsByMethod(startDate, endDate,
                airlineId);

        // Fetch daily ticket sales summary (with optional airline filtering)
        List<FlightMonitoringResponse.DailyTicketStats> dailyTickets = getDailyTickets(startDate, endDate, airlineId);

        // Build and return response
        return BuildTheResponseOfAirline(totalTickets, totalRevenue, ticketsByPaymentStatus, ticketsByAirline, flightsByStatus,
                paymentsByStatus, paymentsByMethod, dailyTickets);
    }

    private FlightMonitoringResponse BuildTheResponseOfAirline(Integer totalTickets, Double totalRevenue,
            Map<String, Integer> ticketsByPaymentStatus,
            List<FlightMonitoringResponse.AirlineTicketStats> ticketsByAirline, Map<String, Integer> flightsByStatus,
            Map<String, Integer> paymentsByStatus, List<FlightMonitoringResponse.PaymentMethodStats> paymentsByMethod,
            List<FlightMonitoringResponse.DailyTicketStats> dailyTickets) {
        return FlightMonitoringResponse.builder()
                .totalTickets(totalTickets)
                .totalRevenue(totalRevenue)
                .ticketsByPaymentStatus(ticketsByPaymentStatus)
                .ticketsByAirline(ticketsByAirline)
                .flightsByStatus(flightsByStatus)
                .paymentsByStatus(paymentsByStatus)
                .paymentsByMethod(paymentsByMethod)
                .dailyTickets(dailyTickets)
                .build();
    }

    private List<FlightMonitoringResponse.DailyTicketStats> getDailyTickets(LocalDate startDate, LocalDate endDate,
            long airlineId) {
        List<Object[]> dailyStatsList = (airlineId == 0)
                ? flightTicketRepository.getDailyTicketSalesSummary(startDate, endDate)
                : flightTicketRepository.getDailyTicketSalesSummaryByAirline(startDate, endDate, airlineId);

        List<FlightMonitoringResponse.DailyTicketStats> dailyTickets = new ArrayList<>();
        for (Object[] row : dailyStatsList) {
            dailyTickets.add(FlightMonitoringResponse.DailyTicketStats.builder()
                    .date(row[0].toString())
                    .count(((Long) row[1]).intValue())
                    .revenue((Double) row[2])
                    .build());
        }
        return dailyTickets;
    }

    private List<FlightMonitoringResponse.PaymentMethodStats> getPaymentsByMethod(LocalDate startDate,
            LocalDate endDate, long airlineId) {
        List<Object[]> paymentMethodList = (airlineId == 0)
                ? ticketPaymentRepository.getTicketPaymentCountsAndRevenueByMethodBetweenDate(startDate, endDate)
                : ticketPaymentRepository.getTicketPaymentCountsAndRevenueByMethodBetweenDateAndAirline(startDate, endDate, airlineId);

        List<FlightMonitoringResponse.PaymentMethodStats> paymentsByMethod = new ArrayList<>();
        for (Object[] row : paymentMethodList) {
            paymentsByMethod.add(FlightMonitoringResponse.PaymentMethodStats.builder()
                    .methodName((String) row[0])
                    .count(((Long) row[1]).intValue())
                    .totalAmount((Double) row[2])
                    .build());
        }
        return paymentsByMethod;
    }

    private Map<String, Integer> getPaymentsByStatus(LocalDate startDate, LocalDate endDate, long airlineId) {
        List<Object[]> paymentStatusList = (airlineId == 0)
                ? ticketPaymentRepository.getPaymentCountsByStatusBetweenDate(startDate, endDate)
                : ticketPaymentRepository.getPaymentCountsByStatusBetweenDateAndAirline(startDate, endDate, airlineId);

        Map<String, Integer> paymentsByStatus = new HashMap<>();
        for (Object[] row : paymentStatusList) {
            String status = row[0].toString();
            Long count = (Long) row[1];
            paymentsByStatus.put(status, count.intValue());
        }
        return paymentsByStatus;
    }

    private Map<String, Integer> getFlightsByStatus(LocalDate startDate, LocalDate endDate, long airlineId) {
        List<Object[]> flightStatusList = (airlineId == 0)
                ? flightTicketRepository.getFlightCountsByStatusBetweenDate(startDate, endDate)
                : flightTicketRepository.getFlightCountsByStatusBetweenDateAndAirline(startDate, endDate, airlineId);

        Map<String, Integer> flightsByStatus = new HashMap<>();
        for (Object[] row : flightStatusList) {
            String status = row[0].toString();
            Long count = (Long) row[1];
            flightsByStatus.put(status, count.intValue());
        }
        return flightsByStatus;
    }

    private List<FlightMonitoringResponse.AirlineTicketStats> getTicketsByAirline(LocalDate startDate,
            LocalDate endDate, long airlineId) {
        List<Object[]> airlineStatsList = (airlineId == 0)
                ? flightTicketRepository.getTicketCountsAndRevenueByAirlineBetweenDate(startDate, endDate)
                : flightTicketRepository.getTicketCountsAndRevenueByAirlineBetweenDateAndAirline(startDate, endDate, airlineId);

        List<FlightMonitoringResponse.AirlineTicketStats> ticketsByAirline = new ArrayList<>();
        for (Object[] row : airlineStatsList) {
            ticketsByAirline.add(FlightMonitoringResponse.AirlineTicketStats.builder()
                    .airlineId((Integer) row[0])
                    .airlineName((String) row[1])
                    .totalTickets(((Long) row[2]).intValue())
                    .totalRevenue((Double) row[3])
                    .build());
        }
        return ticketsByAirline;
    }

    private Map<String, Integer> getTicketsByPaymentStatus(LocalDate startDate, LocalDate endDate, long airlineId) {
        List<Object[]> ticketPaymentStatusList = (airlineId == 0)
                ? flightTicketRepository.getTicketCountsByPaymentStatusBetweenDate(startDate, endDate)
                : flightTicketRepository.getTicketCountsByPaymentStatusBetweenDateAndAirline(startDate, endDate, airlineId);

        Map<String, Integer> ticketsByPaymentStatus = new HashMap<>();
        for (Object[] row : ticketPaymentStatusList) {
            Boolean isPaid = (Boolean) row[0];
            Long count = (Long) row[1];
            ticketsByPaymentStatus.put(isPaid ? "paid" : "unpaid", count.intValue());
        }
        return ticketsByPaymentStatus;
    }

    public List<PartnerShipNameResponse> getAllHotels() {
        return hotelRepository.findAllHotel();
    }

    public List<PartnerShipNameResponse> getAllAirlines() {
        return airlineRepository.findAllAirline();
    }
}

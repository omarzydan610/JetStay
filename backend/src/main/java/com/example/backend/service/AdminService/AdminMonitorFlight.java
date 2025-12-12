package com.example.backend.service.AdminService;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.dto.AdminDTO.FlightMonitoringResponse;
import com.example.backend.entity.FlightTicket;
import com.example.backend.repository.FlightTicketRepository;
import com.example.backend.repository.TicketPaymentRepository;

@Service
public class AdminMonitorFlight {

	@Autowired
	private FlightTicketRepository flightTicketRepository;

	@Autowired
	private TicketPaymentRepository ticketPaymentRepository;

	public FlightMonitoringResponse monitorFlightTransactions(LocalDate startDate, LocalDate endDate,
			long airlineId) {
		// Fetch aggregated ticket statistics (with optional airline filtering)
		List<Object[]> ticketStats = (airlineId == 0)
				? flightTicketRepository.getTotalTicketsCountBetweenDate(startDate, endDate)
				: flightTicketRepository.getTotalTicketsCountBetweenDateAndAirline(startDate, endDate,
						airlineId);
		Object[] object = ticketStats.get(0);
		Integer totalTickets = ((Long) object[0]).intValue();
		Double totalRevenue = (Double) object[1];

		// Fetch ticket payment status breakdown (paid/unpaid) (with optional airline
		// filtering)
		Map<String, Integer> ticketsByPaymentStatus = getTicketsByPaymentStatus(startDate, endDate, airlineId);

		// Fetch tickets by airline (with optional airline filtering)
		List<FlightMonitoringResponse.AirlineTicketStats> ticketsByAirline = getTicketsByAirline(startDate,
				endDate,
				airlineId);

		// Fetch flight status breakdown (with optional airline filtering)
		Map<String, Integer> flightsByStatus = getFlightsByStatus(startDate, endDate, airlineId);

		// Fetch payment status breakdown (with optional airline filtering)
		Map<String, Integer> paymentsByStatus = getPaymentsByStatus(startDate, endDate, airlineId);

		// Fetch payments by method (with optional airline filtering)
		List<FlightMonitoringResponse.PaymentMethodStats> paymentsByMethod = getPaymentsByMethod(startDate,
				endDate,
				airlineId);

		// Fetch daily ticket sales summary (with optional airline filtering)
		List<FlightMonitoringResponse.DailyTicketStats> dailyTickets = getDailyTickets(startDate, endDate,
				airlineId);

		// Build and return response
		return BuildTheResponseOfAirline(totalTickets, totalRevenue, ticketsByPaymentStatus, ticketsByAirline,
				flightsByStatus,
				paymentsByStatus, paymentsByMethod, dailyTickets);
	}

	private FlightMonitoringResponse BuildTheResponseOfAirline(Integer totalTickets, Double totalRevenue,
			Map<String, Integer> ticketsByPaymentStatus,
			List<FlightMonitoringResponse.AirlineTicketStats> ticketsByAirline,
			Map<String, Integer> flightsByStatus,
			Map<String, Integer> paymentsByStatus,
			List<FlightMonitoringResponse.PaymentMethodStats> paymentsByMethod,
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
				: flightTicketRepository.getDailyTicketSalesSummaryByAirline(startDate, endDate,
						airlineId);

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
				? ticketPaymentRepository.getTicketPaymentCountsAndRevenueByMethodBetweenDate(startDate,
						endDate)
				: ticketPaymentRepository.getTicketPaymentCountsAndRevenueByMethodBetweenDateAndAirline(
						startDate, endDate, airlineId);

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
				: ticketPaymentRepository.getPaymentCountsByStatusBetweenDateAndAirline(startDate,
						endDate, airlineId);

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
				: flightTicketRepository.getFlightCountsByStatusBetweenDateAndAirline(startDate,
						endDate, airlineId);

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
				? flightTicketRepository.getTicketCountsAndRevenueByAirlineBetweenDate(startDate,
						endDate)
				: flightTicketRepository.getTicketCountsAndRevenueByAirlineBetweenDateAndAirline(
						startDate, endDate, airlineId);

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
				: flightTicketRepository.getTicketCountsByPaymentStatusBetweenDateAndAirline(startDate,
						endDate, airlineId);

		Map<String, Integer> ticketsByPaymentStatus = new HashMap<>();
		for (Object[] row : ticketPaymentStatusList) {
			Boolean isPaid = (Boolean) row[0];
			Long count = (Long) row[1];
			ticketsByPaymentStatus.put(isPaid ? "paid" : "unpaid", count.intValue());
		}
		return ticketsByPaymentStatus;
	}

	public List<FlightTicket> getTicketDetails(LocalDate startDate, LocalDate endDate, Long airlineId) {
		if (airlineId == 0) {
			return flightTicketRepository.getFlightTicketsDetailBetweenDate(startDate, endDate);
		}
		return flightTicketRepository.getFlightTicketsDetailBetweenDateForArline(startDate, endDate, airlineId);
	}
}

package com.example.backend.service.CronJobs;

import com.example.backend.repository.FlightTicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
public class PendingFlights {

    @Autowired
    private FlightTicketRepository flightTicketRepository;

    @Value("${flight.ticket.expiration.days:2}")
    private int expirationDays;

    @Scheduled(cron = "0 0 0 * * ?") // Runs daily at midnight
    @Transactional
    public void cancelOldPendingTickets() {
        LocalDate thresholdDate = LocalDate.now().minusDays(expirationDays);
        flightTicketRepository.cancelPendingTicketsCreatedBefore(thresholdDate);
    }
}

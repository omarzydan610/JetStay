package com.example.backend.service.CronJobs;

import com.example.backend.repository.FlightTicketRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDate;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;

public class PendingFlightsTest {

    @Mock
    private FlightTicketRepository flightTicketRepository;

    @InjectMocks
    private PendingFlights pendingFlights;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        ReflectionTestUtils.setField(pendingFlights, "expirationDays", 2);
    }

    @Test
    public void testCancelOldPendingTickets() {
        pendingFlights.cancelOldPendingTickets();
        LocalDate expectedThreshold = LocalDate.now().minusDays(2);
        verify(flightTicketRepository).cancelPendingTicketsCreatedBefore(eq(expectedThreshold));
    }
}

package com.example.backend.service.CronJobs;

import com.example.backend.entity.BookingTransaction;
import com.example.backend.entity.Hotel;
import com.example.backend.entity.User;
import com.example.backend.repository.BookingTransactionRepository;
import com.example.backend.service.GenericEmailService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

public class PendingBookingTest {

    @Mock
    private BookingTransactionRepository bookingTransactionRepository;

    @Mock
    private GenericEmailService genericEmailService;

    @InjectMocks
    private PendingBooking pendingBooking;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testRemovePendingBooking() {
        pendingBooking.removePendingBooking();
        // Verifies that the repository method is called with today's date and 2 days
        verify(bookingTransactionRepository).updatePendingBookingThatCheckedInAfterDays(eq(LocalDate.now()), eq(2));
    }

    @Test
    public void testNotifyUserAboutPendingBooking() {
        // Arrange
        BookingTransaction booking = new BookingTransaction();
        User user = new User();
        user.setEmail("test@example.com");
        user.setFirstName("TestUser");

        Hotel hotel = new Hotel();
        hotel.setHotelName("Test Hotel");

        booking.setUser(user);
        booking.setHotel(hotel);
        booking.setBookingDate(LocalDate.now());
        booking.setTotalPrice(100.0f);

        when(bookingTransactionRepository.getPendingBookingThatCheckedInAfterDays(any(LocalDate.now().getClass()),
                eq(3)))
                .thenReturn(List.of(booking));

        // Act
        pendingBooking.NotifyUserAboutPendingBooking();

        // Assert
        verify(bookingTransactionRepository).getPendingBookingThatCheckedInAfterDays(eq(LocalDate.now()), eq(3));
        verify(genericEmailService).sendEmail(
                eq("test@example.com"),
                eq("Urgent: Payment Required for Your Booking at Test Hotel"),
                any(String.class) // Checking HTML content exactly is fragile, confirming it's called is enough or
                                  // could use argument captor
        );
    }

    @Test
    public void testNotifyUserAboutPendingBooking_NoBookings() {
        // Arrange
        when(bookingTransactionRepository.getPendingBookingThatCheckedInAfterDays(any(LocalDate.now().getClass()),
                eq(3)))
                .thenReturn(Collections.emptyList());

        // Act
        pendingBooking.NotifyUserAboutPendingBooking();

        // Assert
        verify(bookingTransactionRepository).getPendingBookingThatCheckedInAfterDays(eq(LocalDate.now()), eq(3));
        verify(genericEmailService, times(0)).sendEmail(any(), any(), any());
    }
}

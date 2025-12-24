package com.example.backend.service.CronJobs;

import com.example.backend.entity.BookingTransaction;
import com.example.backend.repository.BookingTransactionRepository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PendingBooking {
    @Autowired
    BookingTransactionRepository bookingTransactionRepository;

    @Autowired
    com.example.backend.service.GenericEmailService genericEmailService;

    @Scheduled(cron = "0 0 0 * * ?")
    @Transactional
    public void removePendingBooking() {
        bookingTransactionRepository.updatePendingBookingThatCheckedInAfterDays(LocalDate.now(), 2);
    }

    @Scheduled(cron = "0 0 0 * * ?")
    public void NotifyUserAboutPendingBooking() {

        List<BookingTransaction> bookingTransactionList = bookingTransactionRepository
                .getPendingBookingThatCheckedInAfterDays(LocalDate.now(), 3);
        for (BookingTransaction bookingTransaction : bookingTransactionList) {
            String to = bookingTransaction.getUser().getEmail();
            String subject = "Urgent: Payment Required for Your Booking at "
                    + bookingTransaction.getHotel().getHotelName();
            String htmlContent = "<html>" +
                    "<body>" +
                    "<h1>Payment Reminder</h1>" +
                    "<p>Dear " + bookingTransaction.getUser().getFirstName() + ",</p>" +
                    "<p>Your booking for <strong>" + bookingTransaction.getHotel().getHotelName() + "</strong> on "
                    + bookingTransaction.getBookingDate() + " is pending payment.</p>" +
                    "<p>Please pay today to avoid cancellation of your booking.</p>" +
                    "<p>Total Amount: $" + bookingTransaction.getTotalPrice() + "</p>" +
                    "<p>Thank you for choosing JetStay.</p>" +
                    "</body>" +
                    "</html>";

            genericEmailService.sendEmail(to, subject, htmlContent);
        }
    }
}

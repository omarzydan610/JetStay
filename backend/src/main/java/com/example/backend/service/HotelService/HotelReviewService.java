package com.example.backend.service.HotelService;

import com.example.backend.dto.HotelDTO.HotelReviewItemDTO;
import com.example.backend.dto.HotelDTO.HotelReviewRequest;
import com.example.backend.dto.HotelDTO.HotelReviewSummaryDTO;
import com.example.backend.entity.BookingTransaction;
import com.example.backend.entity.Hotel;
import com.example.backend.entity.HotelReview;
import com.example.backend.exception.BadRequestException;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.BookingTransactionRepository;
import com.example.backend.repository.HotelRepository;
import com.example.backend.repository.HotelReviewRepository;
import com.example.backend.service.CommentModerationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class HotelReviewService {

    @Autowired
    private HotelReviewRepository reviewRepository;

    @Autowired
    private BookingTransactionRepository bookingRepository;

    @Autowired
    private HotelRepository hotelRepository;

    @Autowired
    private CommentModerationService moderationService;


    public boolean addReview(Integer userId, HotelReviewRequest reviewdto) {

        if (reviewRepository.existsByBookingTransaction_BookingTransactionId(reviewdto.getBookingTransactionId())) {
            throw new BadRequestException("Review already exists for this booking");
        }

        BookingTransaction booking = bookingRepository.findById(reviewdto.getBookingTransactionId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if(!booking.getStatus().equals(BookingTransaction.Status.COMPLETED)){
            throw new BadRequestException("Booking Transaction isn't completed yet");
        }

        if (!booking.getUser().getUserID().equals(userId)) {
            throw new BadRequestException("You are not allowed to review this booking");
        }

        HotelReview review = new HotelReview();
        review.setUser(booking.getUser());
        review.setHotel(booking.getHotel());
        review.setBookingTransaction(booking);

        reviewMapper(reviewdto, review);

        if (moderationService.isToxic(reviewdto.getComment())) {
            review.setToxicFlag(true);
            reviewRepository.save(review);
            return false;
        }

        review.setToxicFlag(false);
        reviewRepository.save(review);

        // Update Hotel rate
        updateHotelRating(booking.getHotel(), 1);

        return true;
    }



    public boolean editReview(Integer userId, HotelReviewRequest reviewdto) {

        HotelReview review = reviewRepository
                .findByBookingTransaction_BookingTransactionId(reviewdto.getBookingTransactionId())
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        if (!review.getUser().getUserID().equals(userId)) {
            throw new BadRequestException("You cannot edit this review");
        }

        reviewMapper(reviewdto, review);
        review.setRating((float)calculateOverallRate(reviewdto));

        if (moderationService.isToxic(reviewdto.getComment())) {
            review.setToxicFlag(true);
            reviewRepository.save(review);
            return false;
        }

        review.setToxicFlag(false);
        reviewRepository.save(review);

        // Update Hotel rate
        updateHotelRating(review.getHotel(), 0);

        return true;
    }

    public void deleteReview(Integer userId, Integer transactionId){

        HotelReview review = reviewRepository
                .findByBookingTransaction_BookingTransactionId(transactionId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        if (!review.getUser().getUserID().equals(userId)) {
            throw new BadRequestException("You cannot delete this review");
        }

        Hotel hotel = review.getHotel();
        reviewRepository.delete(review);

        // Update Hotel rate
        updateHotelRating(hotel, -1);
    }

    public Page<HotelReviewItemDTO> getHotelReviews(Integer hotelId, int page, int size) {

        Pageable pageable = PageRequest.of(page, size);

        return reviewRepository.getHotelReviews(hotelId, pageable);
    }

    public HotelReviewSummaryDTO getHotelReviewSummary(Integer hotelId){
        return  reviewRepository.getHotelReviewSummary(hotelId);
    }

    private double calculateOverallRate(HotelReviewRequest review) {
        return (
                review.getStaffRate()
                        + review.getComfortRate()
                        + review.getFacilitiesRate()
                        + review.getCleanlinessRate()
                        + review.getValueForMoneyRate()
                        + review.getLocationRate()
        ) / 6.0;
    }

    private void updateHotelRating(Hotel hotel, int rateCountDelta) {
        double newAverageRate = reviewRepository.calculateHotelAverageRate(hotel.getHotelID());
        hotel.setHotelRate((float) newAverageRate);
        hotel.setNumberOfRates(hotel.getNumberOfRates() + rateCountDelta);
        hotelRepository.save(hotel);
    }

    private static void reviewMapper(HotelReviewRequest reviewdto, HotelReview review) {
        review.setStaffRate(reviewdto.getStaffRate());
        review.setComfortRate(reviewdto.getComfortRate());
        review.setFacilitiesRate(reviewdto.getFacilitiesRate());
        review.setCleanlinessRate(reviewdto.getCleanlinessRate());
        review.setValueForMoneyRate(reviewdto.getValueForMoneyRate());
        review.setLocationRate(reviewdto.getLocationRate());
        review.setComment(reviewdto.getComment());
    }
}

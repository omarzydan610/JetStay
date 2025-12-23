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


    public void addReview(Integer userId, HotelReviewRequest reviewdto) {

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

        review.setStaffRate(reviewdto.getStaffRate());
        review.setComfortRate(reviewdto.getComfortRate());
        review.setFacilitiesRate(reviewdto.getFacilitiesRate());
        review.setCleanlinessRate(reviewdto.getCleanlinessRate());
        review.setValueForMoneyRate(reviewdto.getValueForMoneyRate());
        review.setLocationRate(reviewdto.getLocationRate());
        review.setComment(reviewdto.getComment());

        reviewRepository.save(review);

        // Update Hotel rate
        Hotel hotel = booking.getHotel();
        double newRate = reviewRepository.calculateHotelAverageRate(hotel.getHotelID());
        hotel.setHotelRate((float)newRate);
        hotel.setNumberOfRates(hotel.getNumberOfRates()+1);
        hotelRepository.save(hotel);

    }

    public void editReview(Integer userId, HotelReviewRequest reviewdto) {

        HotelReview review = reviewRepository
                .findByBookingTransaction_BookingTransactionId(reviewdto.getBookingTransactionId())
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        if (!review.getUser().getUserID().equals(userId)) {
            throw new BadRequestException("You cannot edit this review");
        }

        review.setStaffRate(reviewdto.getStaffRate());
        review.setComfortRate(reviewdto.getComfortRate());
        review.setFacilitiesRate(reviewdto.getFacilitiesRate());
        review.setCleanlinessRate(reviewdto.getCleanlinessRate());
        review.setValueForMoneyRate(reviewdto.getValueForMoneyRate());
        review.setLocationRate(reviewdto.getLocationRate());
        review.setRating((float)calculateOverallRate(reviewdto));
        review.setComment(reviewdto.getComment());

        reviewRepository.save(review);

        // Update Hotel rate
        Hotel hotel = review.getHotel();
        double newRate = reviewRepository.calculateHotelAverageRate(hotel.getHotelID());
        hotel.setHotelRate((float)newRate);
        hotelRepository.save(hotel);
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
        double newRate = reviewRepository.calculateHotelAverageRate(hotel.getHotelID());
        hotel.setHotelRate((float)newRate);
        hotel.setNumberOfRates(hotel.getNumberOfRates()-1);
        hotelRepository.save(hotel);
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
    if (rateCountDelta != 0) {
        hotel.setNumberOfRates(hotel.getNumberOfRates() + rateCountDelta);
    }
    hotelRepository.save(hotel);
}
}

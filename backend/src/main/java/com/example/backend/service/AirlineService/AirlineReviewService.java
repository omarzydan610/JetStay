package com.example.backend.service.AirlineService;

import com.example.backend.dto.AirlineDTO.*;
import com.example.backend.entity.Airline;
import com.example.backend.entity.FlightReview;
import com.example.backend.entity.FlightTicket;
import com.example.backend.exception.BadRequestException;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.AirlineRepository;
import com.example.backend.repository.FlightReviewRepository;
import com.example.backend.repository.FlightTicketRepository;
import com.example.backend.service.CommentModerationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AirlineReviewService {

    @Autowired
    private FlightReviewRepository reviewRepository;

    @Autowired
    private FlightTicketRepository ticketRepository;

    @Autowired
    private AirlineRepository airlineRepository;

    @Autowired
    private CommentModerationService moderationService;


    public boolean addReview(Integer userId, AirlineReviewRequest request) {

        if (reviewRepository.existsByTicket_TicketId(request.getTicketId())) {
            throw new BadRequestException("Review already exists for this ticket");
        }

        FlightTicket ticket = ticketRepository.findById(request.getTicketId())
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found"));

        if(!ticket.getIsPaid()){
            throw new BadRequestException("Booking Transaction isn't completed yet");
        }

        if (!ticket.getUser().getUserID().equals(userId)) {
            throw new BadRequestException("You are not allowed to review this ticket");
        }


        FlightReview review = new FlightReview();
        review.setUserId(userId);
        review.setFlightId(ticket.getFlight().getFlightID());
        review.setTicket(ticket);

        reviewMapping(request, review);

        if (moderationService.isToxic(request.getComment())) {
            review.setToxicFlag(true);
            reviewRepository.save(review);
            return false;
        }

        review.setToxicFlag(false);
        reviewRepository.save(review);

        //Update Airline Rate
        updateAirlineRating(ticket.getAirline(), 1);
        return true;
    }



    public boolean editReview(Integer userId, AirlineReviewRequest request) {

        FlightReview review = reviewRepository.findByTicket_TicketId(request.getTicketId())
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        if (!review.getUserId().equals(userId)) {
            throw new BadRequestException("You cannot edit this review");
        }

        reviewMapping(request, review);

        if (moderationService.isToxic(request.getComment())) {
            review.setToxicFlag(true);
            reviewRepository.save(review);
            return false;
        }

        review.setToxicFlag(false);
        reviewRepository.save(review);

        //Update Airline Rate
        updateAirlineRating(review.getTicket().getAirline(), 0);

        return true;
    }

    public void deleteReview(Integer userId, Integer ticketId) {

        FlightReview review = reviewRepository.findByTicket_TicketId(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        if (!review.getUserId().equals(userId)) {
            throw new BadRequestException("You cannot delete this review");
        }

        Airline airline = review.getTicket().getAirline();
        reviewRepository.delete(review);

        //Update Airline Rate
        updateAirlineRating(airline, -1);
    }

    public Page<AirlineReviewItemDTO> getAirlineReviews(Integer airlineId, int page, int size) {

        Pageable pageable = PageRequest.of(page, size);
        return reviewRepository.getAirlineReviews(airlineId, pageable);
    }

    public AirlineReviewSummaryDTO getAirlineReviewSummary(Integer airlineId) {
        return reviewRepository.getAirlineReviewSummary(airlineId);
    }

    private Float calculateRating(AirlineReviewRequest r) {
        return (r.getOnTimeRate()
                + r.getComfortRate()
                + r.getStaffRate()
                + r.getAmenitiesRate()) / 4.0f;
    }

    private void updateAirlineRating(Airline airline, int rateCountDelta) {
        double newAverageRate = reviewRepository.calculateAirlineAverageRate(airline.getAirlineID());
        airline.setAirlineRate((float) newAverageRate);
        airline.setNumberOfRates(airline.getNumberOfRates() + rateCountDelta);
        airlineRepository.save(airline);
    }

    private void reviewMapping(AirlineReviewRequest request, FlightReview review) {
        review.setOnTimeRate(request.getOnTimeRate());
        review.setComfortRate(request.getComfortRate());
        review.setStaffRate(request.getStaffRate());
        review.setAmenitiesRate(request.getAmenitiesRate());
        review.setComment(request.getComment());

        review.setRating(calculateRating(request));
    }
}

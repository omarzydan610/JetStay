package com.example.backend.service.SystemAdminService;

import com.example.backend.dto.AdminDashboard.*;
import com.example.backend.dto.UserDto.UserDataResponse;
import com.example.backend.entity.*;
import com.example.backend.exception.BadRequestException;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.mapper.AirlineViewDataMapper;
import com.example.backend.mapper.HotelViewDataMapper;
import com.example.backend.mapper.UserMapper;
import com.example.backend.mapper.UserViewDataMapper;
import com.example.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import static com.example.backend.mapper.UserMapper.getUserData;

@Service
public class AdminDashboardService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private HotelRepository hotelRepository;

    @Autowired
    private AirlineRepository airlineRepository;

    @Autowired
    private FlightReviewRepository flightReviewRepository;

    @Autowired
    private HotelReviewRepository hotelReviewRepository;

    public Page<UserDataDTO> getUsersByCriteria (UserViewCriteriaDTO criteria){
        Pageable pageable = PageRequest.of(criteria.getPage(), criteria.getSize());
        Page<User> usersPage = userRepository.findUsersWithFilters(
                criteria.getSearch(),
                criteria.getRole(),
                criteria.getStatus(),
                pageable
        );
        UserViewDataMapper usermapper = new UserViewDataMapper();
        return usersPage.map(usermapper::DataToDTO);
    }

    public Page<HotelDataDTO> getHotelsByCriteria (HotelViewCriteriaDTO criteria){
        Pageable pageable = PageRequest.of(criteria.getPage(), criteria.getSize());
        Page<Hotel> hotelPage = hotelRepository.findHotelsWithFilters(
                criteria.getSearch(),
                criteria.getCity(),
                criteria.getCountry(),
                criteria.getStatus(),
                pageable
        );
        HotelViewDataMapper hotelmapper = new HotelViewDataMapper();
        return hotelPage.map(hotelmapper::DataToDTO);
    }

    public Page<AirlineDataDTO> getAirlinesByCriteria (AirlineViewCriteriaDTO criteria){
        Pageable pageable = PageRequest.of(criteria.getPage(), criteria.getSize());
        Page<Airline> airlinePage = airlineRepository.findAirlinesWithFilters(
                criteria.getSearch(),
                criteria.getNationality(),
                criteria.getStatus(),
                pageable
        );
        AirlineViewDataMapper airlinemapper = new AirlineViewDataMapper();
        return airlinePage.map(airlinemapper::DataToDTO);
    }

    public UserDataResponse getAirlineAdmin (int airlineID){
        User admin = airlineRepository.findAdminByAirlineID(airlineID)
                .orElseThrow(() -> new ResourceNotFoundException("Admin of this Airline not found "+ airlineID));

        return getUserData(admin);
    }

    public UserDataResponse getHotelAdmin (int hotelID){
        User admin = hotelRepository.findAdminByHotelID(hotelID)
                .orElseThrow(() -> new ResourceNotFoundException("Admin of this Hotel not found "+ hotelID));

        return getUserData(admin);
    }

    public Page<FlaggedReviewDTO> getHotelFlaggedReviews(int page, int size){
        Pageable pageable = PageRequest.of(page, size);
        return hotelReviewRepository.findFlaggedReviews(pageable);
    }

    public Page<FlaggedReviewDTO> getAirlineFlaggedReviews(int page, int size){
        Pageable pageable = PageRequest.of(page, size);
        return flightReviewRepository.findFlaggedReviews(pageable);
    }

    public void deleteFlightFlaggedReview(int reviewID){
        FlightReview review = flightReviewRepository.findById(reviewID)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        if(!review.getToxicFlag()){
            throw new BadRequestException("Can't delete this review");
        }

        flightReviewRepository.delete(review);
    }

    public void deleteHotelFlaggedReview(int reviewID){
        HotelReview review = hotelReviewRepository.findById(reviewID)
                .orElseThrow(()-> new ResourceNotFoundException("Review not found"));

        if(!review.isToxicFlag()){
            throw new BadRequestException("Can't delete this review");
        }

        hotelReviewRepository.delete(review);
    }

    public void approveFlightFlaggedReview(int reviewID){
        FlightReview review = flightReviewRepository.findById(reviewID)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        review.setToxicFlag(false);
        flightReviewRepository.save(review);
    }

    public void approveHotelFlaggedReview(int reviewID){
        HotelReview review = hotelReviewRepository.findById(reviewID)
                .orElseThrow(()-> new ResourceNotFoundException("Review not found"));

        review.setToxicFlag(false);
        hotelReviewRepository.save(review);
    }
}

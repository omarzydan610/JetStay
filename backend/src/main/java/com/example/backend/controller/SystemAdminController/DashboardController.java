package com.example.backend.controller.SystemAdminController;

import com.example.backend.dto.AdminDashboard.*;
import com.example.backend.dto.UserDto.UserDataResponse;
import com.example.backend.dto.response.SuccessResponse;
import com.example.backend.service.SystemAdminService.AdminDashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.repository.query.Param;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/admin/dashboard")
public class DashboardController {

    @Autowired
    private AdminDashboardService adminDashboardService;

    @PostMapping("/users")
    public ResponseEntity<?> getUsersByFilter(@RequestBody UserViewCriteriaDTO criteria){
        Page<UserDataDTO> userData = adminDashboardService.getUsersByCriteria(criteria);
        return ResponseEntity.ok(SuccessResponse.of("Fetch Users Successfully", userData));
    }

    @PostMapping("/hotels")
    public ResponseEntity<?> getHotelsByFilter(@RequestBody HotelViewCriteriaDTO criteria){
        Page<HotelDataDTO> hotelData = adminDashboardService.getHotelsByCriteria(criteria);
        return ResponseEntity.ok(SuccessResponse.of("Fetch Hotels Successfully", hotelData));
    }

    @PostMapping("/airlines")
    public ResponseEntity<?> getAirlinesByFilter(@RequestBody AirlineViewCriteriaDTO criteria){
        Page<AirlineDataDTO> airlineData = adminDashboardService.getAirlinesByCriteria(criteria);
        return ResponseEntity.ok(SuccessResponse.of("Fetch Airlines Successfully", airlineData));
    }

    @GetMapping("/airline-admin/{id}")
    public ResponseEntity<?> getAirlineAdmin(@PathVariable int id){
        UserDataResponse adminData = adminDashboardService.getAirlineAdmin(id);
        return ResponseEntity.ok(SuccessResponse.of("Get Airline Admin Successfully", adminData));
    }

    @GetMapping("/hotel-admin/{id}")
    public ResponseEntity<?> getHotelAdmin(@PathVariable int id){
        UserDataResponse adminData = adminDashboardService.getHotelAdmin(id);
        return ResponseEntity.ok(SuccessResponse.of("Get Hotel Admin Successfully", adminData));
    }

    @GetMapping("/hotel/flagged-reviews")
    public ResponseEntity<?> getHotelFlaggedReviews(@RequestParam("page") int page, @RequestParam("size") int size){
        Page<FlaggedReviewDTO> reviews = adminDashboardService.getHotelFlaggedReviews(page, size);
        return ResponseEntity.ok(SuccessResponse.of("Get Hotel Flagged Reviews Successfully", reviews));
    }

    @GetMapping("/airline/flagged-reviews")
    public ResponseEntity<?> getAirlineFlaggedReviews(@RequestParam("page") int page, @RequestParam("size") int size){
        Page<FlaggedReviewDTO> reviews = adminDashboardService.getAirlineFlaggedReviews(page, size);
        return ResponseEntity.ok(SuccessResponse.of("Get Airline Flagged Reviews Successfully", reviews));
    }

    @DeleteMapping("/hotel/flagged-review/{id}")
    public ResponseEntity<?> deleteHotelFlaggedReview(@PathVariable("id") int reviewID){
        adminDashboardService.deleteHotelFlaggedReview(reviewID);
        return ResponseEntity.ok(SuccessResponse.of("The Review has been deleted Successfully"));
    }

    @DeleteMapping("/airline/flagged-review/{id}")
    public ResponseEntity<?> deleteFlightFlaggedReview(@PathVariable("id") int reviewID){
        adminDashboardService.deleteFlightFlaggedReview(reviewID);
        return ResponseEntity.ok(SuccessResponse.of("The Review has been deleted Successfully"));
    }

    @PutMapping("/hotel/flagged-review/{id}")
    public ResponseEntity<?> approveHotelFlaggedReview(@PathVariable("id") int reviewID){
        adminDashboardService.approveHotelFlaggedReview(reviewID);
        return ResponseEntity.ok(SuccessResponse.of("The Review approved Successfully"));
    }

    @PutMapping("/airline/flagged-review/{id}")
    public ResponseEntity<?> approveFlightFlaggedReview(@PathVariable("id") int reviewID){
        adminDashboardService.approveFlightFlaggedReview(reviewID);
        return ResponseEntity.ok(SuccessResponse.of("The Review approved Successfully"));
    }
}

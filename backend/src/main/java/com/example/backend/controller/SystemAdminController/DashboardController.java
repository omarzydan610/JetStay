package com.example.backend.controller.SystemAdminController;

import com.example.backend.dto.AdminDashboard.*;
import com.example.backend.dto.UserDto.UserDataResponse;
import com.example.backend.dto.response.SuccessResponse;
import com.example.backend.service.SystemAdminService.AdminDashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
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
}

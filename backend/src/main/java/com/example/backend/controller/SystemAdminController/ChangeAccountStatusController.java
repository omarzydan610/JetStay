package com.example.backend.controller.SystemAdminController;

import com.example.backend.dto.response.SuccessResponse;
import com.example.backend.service.SystemAdminService.ChangeAccountStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/status")
public class ChangeAccountStatusController {

    @Autowired
    ChangeAccountStatus changeAccountStatusService;

    @PutMapping("/user/activate")
    public ResponseEntity<?> activateUser(@RequestParam String email) {
        changeAccountStatusService.activateUser(email);
        return ResponseEntity.ok(SuccessResponse.of("User activated successfully"));
    }

    @PutMapping("/user/deactivate")
    public ResponseEntity<?> deactivateUser(@RequestParam String email, @RequestParam String reason) {
        changeAccountStatusService.deactivateUser(email, reason);
        return ResponseEntity.ok(SuccessResponse.of("User Deactivated successfully"));
    }

    @PutMapping("airline/activate")
    public ResponseEntity<?> activateAirline(@RequestParam int airlineID){
        changeAccountStatusService.activateAirline(airlineID);
        return ResponseEntity.ok(SuccessResponse.of("Airline Activated successfully"));
    }

    @PutMapping("airline/deactivate")
    public ResponseEntity<?> deactivateAirline(@RequestParam int airlineID, @RequestParam String reason){
        changeAccountStatusService.deactivateAirline(airlineID, reason);
        return ResponseEntity.ok(SuccessResponse.of("Airline Deactivated successfully"));
    }

    @PutMapping("hotel/activate")
    public ResponseEntity<?> activateHotel(@RequestParam int hotelID){
        changeAccountStatusService.activateHotel(hotelID);
        return ResponseEntity.ok(SuccessResponse.of("Hotel Activated successfully"));
    }

    @PutMapping("hotel/deactivate")
    public ResponseEntity<?> deactivateHotel(@RequestParam int hotelID, @RequestParam String reason){
        changeAccountStatusService.deactivateHotel(hotelID, reason);
        return ResponseEntity.ok(SuccessResponse.of("Hotel Deactivated successfully"));
    }

}

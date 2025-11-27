package com.example.backend.controller.FlightController;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.dto.FlightDTO.FlightRequest;
import com.example.backend.dto.response.SuccessResponse;
import com.example.backend.entity.Flight;
import com.example.backend.service.FlightService.FlightService;
import org.springframework.security.core.Authentication;
import io.jsonwebtoken.Claims;

@RestController
@RequestMapping("/api/flight")
public class FlightController {
    @Autowired
    private FlightService flightService;

    @GetMapping("/{id}")
    public ResponseEntity<?> getFlightById(@PathVariable int id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Claims claims = (Claims) auth.getCredentials();
        int airlineID = claims.get("airline_id", Integer.class);
        Flight flight = flightService.getFlightById(id, airlineID);
        return ResponseEntity.ok(SuccessResponse.of("Flight retrieved successfully", flight));
    }

    @PostMapping("/add")
    public ResponseEntity<?> addFlight(@RequestBody FlightRequest flightRequest) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Claims claims = (Claims) auth.getCredentials();
        flightService.addFlight(flightRequest, claims.get("airline_id", Integer.class));
        return ResponseEntity.ok(SuccessResponse.of("Flight add successfully"));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteFlight(@PathVariable int id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Claims claims = (Claims) auth.getCredentials();
        int airlineID = claims.get("airline_id", Integer.class);
        flightService.deleteFlight(id, airlineID);
        return ResponseEntity.ok(SuccessResponse.of("Flight deleted successfully"));
    }

    @PatchMapping("/update/{flightID}")
    public ResponseEntity<?> updateFlight(@PathVariable int flightID, @RequestBody FlightRequest flightRequest) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Claims claims = (Claims) auth.getCredentials();
        int airlineID = claims.get("airline_id", Integer.class);
        flightService.updateFlight(flightID, flightRequest, airlineID);
        return ResponseEntity.ok(SuccessResponse.of("Flight updated successfully"));
    }

    @GetMapping("/")
    public ResponseEntity<?> getAllFlightForAirLine(@RequestParam(defaultValue = "0") int page , @RequestParam(defaultValue = "10") int size) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Claims claims = (Claims) auth.getCredentials();
        Integer airlineID = claims.get("airline_id", Integer.class);
        List<Flight> flights = flightService.getAllFlightForAirLine(airlineID, page, size);
        return ResponseEntity.ok(SuccessResponse.of("Flights retrieved successfully", flights));
    }
}

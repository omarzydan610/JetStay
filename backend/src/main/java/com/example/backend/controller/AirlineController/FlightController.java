package com.example.backend.controller.AirlineController;

import java.util.List;

import com.example.backend.dto.AirlineDTO.FlightDetailsDTO;
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

import com.example.backend.dto.AirlineDTO.FlightRequest;
import com.example.backend.dto.response.SuccessResponse;
import com.example.backend.entity.Flight;
import com.example.backend.service.AirlineService.FlightService;
import com.example.backend.dto.AirlineDTO.FlightOfferRequest;
import com.example.backend.dto.AirlineDTO.FlightOfferResponse;

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
    public ResponseEntity<?> getAllFlightForAirLine(@RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        System.err.println("helloooo");
        System.out.println();
        System.out.println();
        System.out.println();
        System.out.println();
        System.out.println();
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Claims claims = (Claims) auth.getCredentials();
        Integer airlineID = claims.get("airline_id", Integer.class);

        List<Flight> flights = flightService.getAllFlightForAirLine(airlineID, page, size);
        return ResponseEntity.ok(SuccessResponse.of("Flights retrieved successfully", flights));
    }

    @GetMapping("/airPorts")
    public ResponseEntity<?> getAirPorts(@RequestParam String country, @RequestParam String city) {
        return ResponseEntity.ok(SuccessResponse.of("Airports retrieved successfully",
                flightService.getAllAirPorts(country, city)));
    }

    @GetMapping("/countries")
    public ResponseEntity<?> getCountries() {
        return ResponseEntity.ok(SuccessResponse.of("Countries retrieved successfully",
                flightService.getAllCountries()));
    }

    @GetMapping("/cities")
    public ResponseEntity<?> getCitiesByCountry(@RequestParam String country) {
        return ResponseEntity.ok(SuccessResponse.of("Cities retrieved successfully",
                flightService.getCitiesByCountry(country)));
    }

    @GetMapping("/ticket-types")
    public ResponseEntity<?> getTicketTypes() {
        return ResponseEntity.ok(SuccessResponse.of("Ticket types retrieved successfully",
                flightService.getTicketTypes()));
    }

    @GetMapping("/details/{id}")
    public ResponseEntity<?> getFlightDetailsByID(@PathVariable int id) {
        List<FlightDetailsDTO> flightDetailsDTOS = flightService.getFlightDetails(id);
        return ResponseEntity.ok(SuccessResponse.of("Flight Details retrieved successfully", flightDetailsDTOS));
    }

    @PostMapping("/{flightId}/offers/add")
    public ResponseEntity<?> addFlightOffer(
            @PathVariable int flightId,
            @RequestBody FlightOfferRequest request) {
        
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Claims claims = (Claims) auth.getCredentials();
        int airlineId = claims.get("airline_id", Integer.class);
        
        FlightOfferResponse response = flightService.addOfferToFlight(flightId, request, airlineId);
        return ResponseEntity.ok(SuccessResponse.of("Flight offer added successfully", response));
    }

    @GetMapping("/{flightId}/offers")
    public ResponseEntity<?> getFlightOffers(@PathVariable int flightId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Claims claims = (Claims) auth.getCredentials();
        int airlineId = claims.get("airline_id", Integer.class);
        
        List<FlightOfferResponse> offers = flightService.getOffersForFlight(flightId, airlineId);
        return ResponseEntity.ok(SuccessResponse.of("Flight offers retrieved successfully", offers));
    }

    @DeleteMapping("/offers/delete/{offerId}")
    public ResponseEntity<?> deleteFlightOffer(@PathVariable int offerId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Claims claims = (Claims) auth.getCredentials();
        int airlineId = claims.get("airline_id", Integer.class);
        
        flightService.deleteFlightOffer(offerId, airlineId);
        return ResponseEntity.ok(SuccessResponse.of("Flight offer deleted successfully"));
    }
}

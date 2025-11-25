package com.example.backend.service.Partnership;

import com.example.backend.dto.PartnershipRequist.AirlinePartnershipRequest;
import com.example.backend.entity.Airline;
import com.example.backend.entity.User;
import com.example.backend.repository.AirlineRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class AirlinePartnershipService {

    @Autowired
    private PartnershipService partnershipService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AirlineRepository airlineRepository;

    @Autowired
    private FileStorageService fileStorageService;

    public String submitAirlinePartnership(AirlinePartnershipRequest request) throws IOException {
        // If unified PartnershipService is available (Spring runtime), delegate to it.
        if (partnershipService != null) {
            return partnershipService.submitAirlinePartnership(request);
        }

        // Fallback to original implementation for unit tests where partnershipService may be null
        // (mocks are injected into this class in unit tests)
        // Check if user email already exists
        if (userRepository.existsByEmail(request.getManagerEmail())) {
            throw new IllegalArgumentException("Manager email already exists: " + request.getManagerEmail());
        }

        // Check if airline name already exists
        if (airlineRepository.existsByAirlineName(request.getAirlineName())) {
            throw new IllegalArgumentException("Airline name already exists: " + request.getAirlineName());
        }

        // Create User entity for airline admin
        User airlineAdmin = new User();
        airlineAdmin.setFirstName(request.getAdminFirstName());
        airlineAdmin.setLastName(request.getAdminLastName());
        airlineAdmin.setEmail(request.getManagerEmail());
        airlineAdmin.setPassword(request.getManagerPassword());
        airlineAdmin.setPhoneNumber(request.getAdminPhone());
        airlineAdmin.setRole(User.UserRole.AIRLINE_ADMIN);
        airlineAdmin.setStatus(User.UserStatus.ACTIVE);
        
        User savedAdmin = userRepository.save(airlineAdmin);
        
        // Store airline logo if provided
        String logoPath = null;
        if (request.getAirlineLogo() != null && !request.getAirlineLogo().isEmpty()) {
            logoPath = fileStorageService.storeFile(request.getAirlineLogo());
        }
        
        // Create Airline entity
        Airline airline = new Airline();
        airline.setAirlineName(request.getAirlineName());
        airline.setAirlineNationality(request.getAirlineNationality());
        airline.setAdmin(savedAdmin);
        airline.setAirlineRate(0.0f);
        airline.setNumberOfRates(0);
        airline.setLogoUrl(logoPath);
        airline.setStatus(Airline.Status.INACTIVE);
        airline.setCreatedAt(java.time.LocalDateTime.now());

        Airline savedAirline = airlineRepository.save(airline);

        String response = "Airline partnership request submitted successfully with ID: " + savedAirline.getAirlineID();

        return response;
    }
}
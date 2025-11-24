// service/PartnershipService.java
package com.example.backend.service.Partnership;

import com.example.backend.dto.PartnershipRequist.AirlinePartnershipRequest;
import com.example.backend.dto.PartnershipRequist.AirlinePartnershipResponse;
import com.example.backend.entity.Airline;
import com.example.backend.entity.User;
import com.example.backend.repository.AirlineRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.time.LocalDateTime;

@Service
@Transactional
public class AirlinePartnershipService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AirlineRepository airlineRepository;

    @Autowired
    private FileStorageService fileStorageService;


    public AirlinePartnershipResponse submitAirlinePartnership(AirlinePartnershipRequest request) throws IOException {
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
        airline.setCreatedAt(LocalDateTime.now());

        Airline savedAirline = airlineRepository.save(airline);

        // Prepare response
        AirlinePartnershipResponse response = new AirlinePartnershipResponse();
        response.setAirlineID(savedAirline.getAirlineID());
        response.setAirlineName(savedAirline.getAirlineName());
        response.setAirlineNationality(savedAirline.getAirlineNationality());
        response.setManagerEmail(savedAdmin.getEmail());
        response.setAirlineLogoPath(savedAirline.getLogoUrl());
        response.setNumberOfRates(savedAirline.getNumberOfRates());
        response.setCreatedAt(savedAirline.getCreatedAt());
        response.setStatus(savedAirline.getStatus().toString());

        return response;
    }
}
package com.example.backend.service.AirlineService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.dto.AirlineDTO.AirlineDataResponse;
import com.example.backend.dto.AirlineDTO.AirlineUpdateDataRequest;
import com.example.backend.entity.Airline;
import com.example.backend.entity.User;
import com.example.backend.exception.BadRequestException;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.mapper.AirlineDataMapper;
import com.example.backend.repository.AirlineRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.AuthService.JwtAuthService;

@Service
public class AirlineDataService {

  @Autowired
  private JwtAuthService jwtAuthService;
  @Autowired
  private UserRepository userRepository;
  @Autowired
  private AirlineRepository airlineRepository;

  public AirlineDataResponse getData(String authorizationHeader) {
    String token = jwtAuthService.extractTokenFromHeader(authorizationHeader);
    String adminEmail = jwtAuthService.extractEmail(token);
    User adminUser = userRepository.findByEmail(adminEmail)
        .orElseThrow(() -> new BadRequestException("Admin user not found"));
    if (User.UserRole.AIRLINE_ADMIN != adminUser.getRole()) {
      throw new BadRequestException("User is not an airline admin");
    }
    Airline airline = airlineRepository.findByAdminUserID(adminUser.getUserID())
        .orElseThrow(() -> new ResourceNotFoundException("Airline not found"));
    if (airline.getAirlineID() != jwtAuthService.extractAirlineID(token)) {
      throw new BadRequestException("Token does not match airline admin");
    }
    AirlineDataResponse airlineDataResponse = AirlineDataMapper.mapToResponse(airline);
    return airlineDataResponse;
  }

  public AirlineDataResponse updateData(String authorizationHeader,
      AirlineUpdateDataRequest request) {
        if(request.getName() == null &&
           request.getNationality() == null &&
           request.getLogoUrl() == null) {
          throw new BadRequestException("Update request cannot be empty");
        }
    String token = jwtAuthService.extractTokenFromHeader(authorizationHeader);
    String adminEmail = jwtAuthService.extractEmail(token);
    User adminUser = userRepository.findByEmail(adminEmail)
        .orElseThrow(() -> new BadRequestException("Admin user not found"));
    if (User.UserRole.AIRLINE_ADMIN != adminUser.getRole()) {
      throw new BadRequestException("User is not an airline admin");
    }
    Airline airline = airlineRepository.findByAdminUserID(adminUser.getUserID())
        .orElseThrow(() -> new ResourceNotFoundException("Airline not found"));
    if (airline.getAirlineID() != jwtAuthService.extractAirlineID(token)) {
      throw new BadRequestException("Token does not match airline admin");
    }
    // Update fields
    try {
      if (request.getName() != null)
        airline.setAirlineName(request.getName());
      if (request.getNationality() != null)
        airline.setAirlineNationality(request.getNationality());
      if (request.getLogoUrl() != null)
        airline.setLogoUrl(request.getLogoUrl());
      airlineRepository.save(airline);
      return AirlineDataMapper.mapToResponse(airline);
    } catch (Exception e) {
      throw new BadRequestException("Failed to update airline data: " + e.getMessage());
    }
  }

}

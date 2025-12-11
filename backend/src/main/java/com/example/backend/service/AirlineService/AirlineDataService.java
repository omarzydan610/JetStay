package com.example.backend.service.AirlineService;

import java.io.IOException;
import java.util.List;

import com.example.backend.cache.FlightCacheManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.dto.AirlineDTO.AirlineDataResponse;
import com.example.backend.dto.AirlineDTO.AirlineUpdateDataRequest;
import com.example.backend.dto.AirlineDTO.CityDtoResponse;
import com.example.backend.dto.AirlineDTO.CountryDtoResponse;
import com.example.backend.entity.Airline;
import com.example.backend.entity.Airport;
import com.example.backend.entity.User;
import com.example.backend.exception.BadRequestException;
import com.example.backend.exception.InternalServerErrorException;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.mapper.AirlineDataMapper;
import com.example.backend.repository.AirlineRepository;
import com.example.backend.repository.AirportRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.AuthService.JwtAuthService;
import com.example.backend.service.Partnership.FileStorageService;

@Service
public class AirlineDataService {

  @Autowired
  private JwtAuthService jwtAuthService;
  @Autowired
  private UserRepository userRepository;
  @Autowired
  private AirlineRepository airlineRepository;

  @Autowired
  private FlightCacheManager flightCacheManager;
  @Autowired
  private FileStorageService fileStorageService;

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

  public void updateData(String authorizationHeader,
      AirlineUpdateDataRequest request) {
    if (request.getName() == null &&
        request.getNationality() == null &&
        (request.getLogoFile() == null || request.getLogoFile().isEmpty())) {
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

      // Handle logo file upload
      if (request.getLogoFile() != null && !request.getLogoFile().isEmpty()) {
        try {
          String logoUrl = fileStorageService.storeFile(request.getLogoFile());
          airline.setLogoUrl(logoUrl);
        } catch (IOException e) {
          throw new InternalServerErrorException("Failed to upload airline logo: " + e.getMessage());
        }
      }
      airlineRepository.save(airline);
      if (flightCacheManager != null)
        flightCacheManager.evictAll();
    } catch (InternalServerErrorException e) {
      throw e;
    } catch (Exception e) {
      throw new BadRequestException("Failed to update airline data: " + e.getMessage());
    }
  }
}

package com.example.backend.service.HotelService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.dto.HotelDTO.HotelDataResponse;
import com.example.backend.dto.HotelDTO.HotelUpdateDataRequest;
import com.example.backend.entity.Hotel;
import com.example.backend.entity.User;
import com.example.backend.exception.BadRequestException;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.mapper.HotelDataMapper;
import com.example.backend.repository.HotelRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.AuthService.JwtAuthService;

@Service
public class HotelDataService {

  @Autowired
  private JwtAuthService jwtAuthService;
  @Autowired
  private UserRepository userRepository;
  @Autowired
  private HotelRepository hotelRepository;

  public HotelDataResponse getData(String authorizationHeader) {
    String token = jwtAuthService.extractTokenFromHeader(authorizationHeader);
    String adminEmail = jwtAuthService.extractEmail(token);
    User adminUser = userRepository.findByEmail(adminEmail)
        .orElseThrow(() -> new BadRequestException("Admin user not found"));
    if (User.UserRole.HOTEL_ADMIN != adminUser.getRole()) {
      throw new BadRequestException("User is not a hotel admin");
    }
    Hotel hotel = hotelRepository.findByAdminUserID(adminUser.getUserID())
        .orElseThrow(() -> new ResourceNotFoundException("Hotel not found"));
    if (hotel.getHotelID() != jwtAuthService.extractHotelID(token)) {
      throw new BadRequestException("Token does not match hotel admin");
    }
    HotelDataResponse hotelDataResponse = HotelDataMapper.mapToResponse(hotel);
    return hotelDataResponse;
  }

  public void updateData(String authorizationHeader,
      HotelUpdateDataRequest request) {
    if (request.getName() == null &&
        request.getCity() == null &&
        request.getCountry() == null &&
        request.getLongitude() == null &&
        request.getLatitude() == null &&
        request.getLogoUrl() == null) {
      throw new BadRequestException("Update request cannot be empty");
    }
    String token = jwtAuthService.extractTokenFromHeader(authorizationHeader);
    String adminEmail = jwtAuthService.extractEmail(token);
    User adminUser = userRepository.findByEmail(adminEmail)
        .orElseThrow(() -> new BadRequestException("Admin user not found"));
    if (User.UserRole.HOTEL_ADMIN != adminUser.getRole()) {
      throw new BadRequestException("User is not a hotel admin");
    }
    Hotel hotel = hotelRepository.findByAdminUserID(adminUser.getUserID())
        .orElseThrow(() -> new ResourceNotFoundException("Hotel not found"));
    if (hotel.getHotelID() != jwtAuthService.extractHotelID(token)) {
      throw new BadRequestException("Token does not match hotel admin");
    }
    // Update fields
    try {
      if (request.getName() != null)
        hotel.setHotelName(request.getName());
      if (request.getCity() != null)
        hotel.setCity(request.getCity());
      if (request.getCountry() != null)
        hotel.setCountry(request.getCountry());
      if (request.getLongitude() != null)
        hotel.setLongitude(request.getLongitude());
      if (request.getLatitude() != null)
        hotel.setLatitude(request.getLatitude());
      if (request.getLogoUrl() != null)
        hotel.setLogoUrl(request.getLogoUrl());
      hotelRepository.save(hotel);
    } catch (Exception e) {
      throw new BadRequestException("Failed to update hotel data: " + e.getMessage());
    }
  }

}

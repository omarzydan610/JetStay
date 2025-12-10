package com.example.backend.service.UserData;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.dto.UserDto.UserDataResponse;
import com.example.backend.entity.User;
import com.example.backend.exception.BadRequestException;
import com.example.backend.mapper.UserMapper;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.AuthService.JwtAuthService;
import com.example.backend.dto.UserDto.UserUpdateRequest;

@Service
public class UserDataService {

  @Autowired
  private JwtAuthService jwtAuthService;
  @Autowired
  private UserRepository userRepository;

  public UserDataResponse getData(String authorizationHeader) {
    User user = this.getUserFromToken(authorizationHeader);
    UserDataResponse userDataResponse = UserMapper.getUserData(user);
    return userDataResponse;
  }

  public UserDataResponse updateData(String authorizationHeader, UserUpdateRequest request) {
    User user = this.getUserFromToken(authorizationHeader);

    // Update user fields
    user.setFirstName(request.getFirstName());
    user.setLastName(request.getLastName());
    user.setPhoneNumber(request.getPhoneNumber());

    userRepository.save(user);

    UserDataResponse userDataResponse = UserMapper.getUserData(user);
    return userDataResponse;
  }

  private User getUserFromToken(String authorizationHeader) {
    String token = jwtAuthService.extractTokenFromHeader(authorizationHeader);
    String userEmail = jwtAuthService.extractEmail(token);
    User user = userRepository.findByEmail(userEmail)
        .orElseThrow(() -> new BadRequestException("User not found"));
    Integer userID = jwtAuthService.extractUserId(token);
    if (userID != user.getUserID()) {
      throw new BadRequestException("Token does not match user");
    }
    return user;
  }
}

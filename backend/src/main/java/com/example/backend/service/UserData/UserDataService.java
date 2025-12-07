package com.example.backend.service.UserData;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.dto.UserDto.UserDataResponse;
import com.example.backend.entity.User;
import com.example.backend.exception.BadRequestException;
import com.example.backend.mapper.UserMapper;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.AuthService.JwtAuthService;

@Service
public class UserDataService {

  @Autowired
  private JwtAuthService jwtAuthService;
  @Autowired
  private UserRepository userRepository;

  public UserDataResponse getData(String authorizationHeader) {
    String token = jwtAuthService.extractTokenFromHeader(authorizationHeader);
    String userEmail = jwtAuthService.extractEmail(token);
    User user = userRepository.findByEmail(userEmail)
        .orElseThrow(() -> new BadRequestException("User not found"));
    Integer userID = jwtAuthService.extractUserId(token);
    if (userID != user.getUserID()) {
      throw new BadRequestException("Token does not match user");
    }
    UserDataResponse userDataResponse = UserMapper.getUserData(user);
    return userDataResponse;
  }
}

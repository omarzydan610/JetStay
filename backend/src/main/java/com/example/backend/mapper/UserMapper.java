package com.example.backend.mapper;

import com.example.backend.dto.AuthDTO.UserDTO;
import com.example.backend.dto.UserDto.UserDataResponse;
import com.example.backend.entity.User;

public class UserMapper {

    public User signupToUser(UserDTO newUser, User.UserRole userRole) {
        User user = new User();
        user.setFirstName(newUser.getFirstName());
        user.setLastName(newUser.getLastName());
        user.setEmail(newUser.getEmail());
        user.setPassword(newUser.getPassword());
        user.setPhoneNumber(newUser.getPhoneNumber());
        user.setStatus(User.UserStatus.ACTIVE);
        user.setRole(userRole);
        return user;
    }

    public static UserDataResponse getUserData(User user) {
        UserDataResponse response = new UserDataResponse(
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getPhoneNumber(),
                user.getRole(),
                user.getStatus());
        return response;
    }

}

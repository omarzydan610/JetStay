package com.example.backend.mapper;

import com.example.backend.dto.AdminDashboard.UserDataDTO;
import com.example.backend.entity.User;

public class UserViewDataMapper {
    public UserDataDTO DataToDTO(User user){
        UserDataDTO dto = new UserDataDTO();
        dto.setId(user.getUserID());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setEmail(user.getEmail());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setRole(user.getRole());
        dto.setStatus(user.getStatus());
        return dto;
    }
}

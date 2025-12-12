package com.example.backend.dto.AdminDashboard;

import com.example.backend.entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserViewCriteriaDTO {
    private String search;
    private User.UserRole role;
    private User.UserStatus status;
    private int page;
    private int size;
}

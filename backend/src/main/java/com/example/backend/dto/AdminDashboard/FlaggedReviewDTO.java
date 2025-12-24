package com.example.backend.dto.AdminDashboard;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FlaggedReviewDTO {
    Integer reviewId;
    String comment;
    Float rating;
    LocalDateTime createdAt;
    String username;
    String institutionName;
}

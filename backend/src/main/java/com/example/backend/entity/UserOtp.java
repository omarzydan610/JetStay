package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_otp")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserOtp {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "otp_id")
  private Integer otpID;

  @ManyToOne
  @JoinColumn(name = "user_id", nullable = false)
  private User user;

  @Column(name = "otp", nullable = false)
  private String otp;

  @Column(name = "created_at", nullable = false)
  private LocalDateTime createdAt;

  @Column(name = "expire_at", nullable = false)
  private LocalDateTime expireAt;

  @PrePersist
  protected void onCreate() {
    createdAt = LocalDateTime.now();
    expireAt = createdAt.plusHours(1);
  }
}

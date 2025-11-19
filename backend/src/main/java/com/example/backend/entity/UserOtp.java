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
  @JoinColumn(name = "user_id")
  private User user;

  @Column(name = "otp")
  private String otp;

  @Column(name = "created_at")
  private LocalDateTime createdAt;

  @Column(name = "expire_at")
  private LocalDateTime expireAt;

  @PrePersist
  protected void onCreate() {
    createdAt = LocalDateTime.now();
  }
}

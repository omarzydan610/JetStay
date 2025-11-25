package com.example.backend.repository;

import com.example.backend.entity.User;
import com.example.backend.entity.UserOtp;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface UserOtpRepository extends JpaRepository<UserOtp, Integer> {

  Optional<UserOtp> findByUserAndOtp(User user, String otp);

}

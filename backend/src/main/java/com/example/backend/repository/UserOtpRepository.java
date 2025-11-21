package com.example.backend.repository;

import com.example.backend.entity.UserOtp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface UserOtpRepository extends JpaRepository<UserOtp, Integer> {

}

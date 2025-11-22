package com.example.backend.service.AuthService;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.Random;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.backend.entity.User;
import com.example.backend.entity.UserOtp;
import com.example.backend.repository.UserOtpRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.GenericEmailService;

@Service
public class ForgetResetPasswordService {

  @Autowired
  private GenericEmailService emailService;
  @Autowired
  private UserRepository userRepository;
  @Autowired
  private UserOtpRepository userOtpRepository;

  private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

  public void forgotPassword(String email) {
    User user = getUserByEmail(email);

    String otp = generateOtp();

    String userName = user.getFirstName();

    saveOTPAndSendEmail(email, otp, user, userName);
  }

  private User getUserByEmail(String email) {
    User user = userRepository.findByEmail(email)
        .orElseThrow(() -> new RuntimeException("User not found with this email"));
    if (user.getStatus() == User.UserStatus.DEACTIVATED) {
      throw new RuntimeException("User account is deactivated");
    }
    return user;
  }

  @Transactional
  private void saveOTPAndSendEmail(String email, String otp, User user, String userName) {
    // Save OTP to database first
    UserOtp userOtp = new UserOtp();
    userOtp.setUser(user);
    userOtp.setOtp(otp);
    userOtp = userOtpRepository.save(userOtp);

    try {
      String template = prepareTemplate(otp, userName);
      emailService.sendEmail(email, "Your OTP Code", template);
      System.out.println("OTP email sent successfully to: " + email);
    } catch (Exception e) {
      // If email sending fails, delete the OTP from database
      System.err.println("Failed to send OTP email, removing OTP from database");
      userOtpRepository.delete(userOtp);
      throw new RuntimeException("Failed to send OTP email: " + e.getMessage(), e);
    }
  }

  private String prepareTemplate(String otp, String userName) throws Exception {
    ClassPathResource resource = new ClassPathResource("template/otp_template.html");
    System.out.println(resource.exists() ? "Template found" : "Template not found");
    String template;
    try (BufferedReader reader = new BufferedReader(
        new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8))) {
      template = reader.lines().collect(Collectors.joining("\n"));
    }
    template = template.replace("${otp}", otp);
    template = template.replace("${userName}", userName);
    return template;
  }

  private String generateOtp() {
    Random random = new Random();
    int otp = 100000 + random.nextInt(900000);
    return String.valueOf(otp);
  }

  public void verifyOTPAndResetPassword(String email, String otp, String newPassword) {
    System.out.println("Verifying OTP for email: " + email);
    User user = verifyOtp(email, otp);
    changePassword(user, newPassword);
  }

  private User verifyOtp(String email, String otp) {
    User user = userRepository.findByEmail(email)
        .orElseThrow(() -> new RuntimeException("User not found with this email"));

    UserOtp userOtp = userOtpRepository.findByUserAndOtp(user, otp)
        .orElseThrow(() -> new RuntimeException("Invalid OTP"));

    // check if OTP is expired
    if (userOtp.getExpireAt().isBefore(java.time.LocalDateTime.now())) {
      // OTP is expired, delete it from database
      userOtpRepository.delete(userOtp);
      throw new RuntimeException("OTP has expired");
    }

    return user;

  }

  private void changePassword(User user, String newPassword) {
    String hashedPassword = passwordEncoder.encode(newPassword);
    user.setPassword(hashedPassword);
    userRepository.save(user);
  }
}

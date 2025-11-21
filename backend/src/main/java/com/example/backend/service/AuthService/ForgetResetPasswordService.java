package com.example.backend.service.AuthService;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.Random;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
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

  @Transactional
  public void forgotPassword(String email) {
    User user = userRepository.findByEmail(email)
        .orElseThrow(() -> new RuntimeException("User not found with this email"));
    if (user.getStatus() == User.UserStatus.DEACTIVATED) {
      throw new RuntimeException("User account is deactivated");
    }

    String otp = generateOtp();
    String userName = user.getFirstName();

    // Save OTP to database first
    UserOtp userOtp = new UserOtp();
    userOtp.setUser(user);
    userOtp.setOtp(otp);
    userOtp = userOtpRepository.save(userOtp);

    System.out.println("OTP saved to database: " + otp + " for user: " + email);

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
}

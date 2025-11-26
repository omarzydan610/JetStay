package com.example.backend.service.AuthService;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.Random;
import java.util.stream.Collectors;

import org.springframework.core.io.ClassPathResource;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.backend.entity.User;
import com.example.backend.entity.UserOtp;
import com.example.backend.exception.BadRequestException;
import com.example.backend.exception.InternalServerErrorException;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.UserOtpRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.GenericEmailService;

@Service
public class ForgetResetPasswordService {

  private final GenericEmailService emailService;
  private final UserRepository userRepository;
  private final UserOtpRepository userOtpRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtPassResetService jwtPasswordResetService;

  public ForgetResetPasswordService(
      GenericEmailService emailService,
      UserRepository userRepository,
      UserOtpRepository userOtpRepository,
      PasswordEncoder passwordEncoder,
      JwtPassResetService jwtPasswordResetService) {
    this.emailService = emailService;
    this.userRepository = userRepository;
    this.userOtpRepository = userOtpRepository;
    this.passwordEncoder = passwordEncoder;
    this.jwtPasswordResetService = jwtPasswordResetService;
  }

  public void forgotPassword(String email) {
    // Validate input
    if (email == null || email.trim().isEmpty()) {
      throw new BadRequestException("Email is required");
    }

    User user = getUserByEmail(email);

    String otp = generateOtp();

    String userName = user.getFirstName();

    saveOTPAndSendEmail(email, otp, user, userName);
  }

  private User getUserByEmail(String email) {
    User user = userRepository.findByEmail(email)
        .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
    if (user.getStatus() == User.UserStatus.DEACTIVATED) {
      throw new BadRequestException("User account is deactivated");
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
    } catch (Exception e) {
      // If email sending fails, delete the OTP from database
      userOtpRepository.delete(userOtp);
      throw new InternalServerErrorException("Failed to send OTP email: " + e.getMessage(), e);
    }
  }

  private String prepareTemplate(String otp, String userName) throws Exception {
    ClassPathResource resource = new ClassPathResource("template/otp_template.html");
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

  public String verifyOtp(String email, String otp) {
    // Validate inputs
    if (email == null || email.trim().isEmpty()) {
      throw new BadRequestException("Email is required");
    }
    if (otp == null || otp.trim().isEmpty()) {
      throw new BadRequestException("OTP is required");
    }

    User user = userRepository.findByEmail(email)
        .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

    UserOtp userOtp = userOtpRepository.findByUserAndOtp(user, otp)
        .orElseThrow(() -> new BadRequestException("Invalid OTP"));

    // check if OTP is expired
    if (userOtp.getExpireAt().isBefore(java.time.LocalDateTime.now())) {
      // OTP is expired, delete it from database
      userOtpRepository.delete(userOtp);
      throw new BadRequestException("OTP has expired");
    }

    // Delete the used OTP after successful verification
    userOtpRepository.delete(userOtp);

    // Generate and return JWT token
    return jwtPasswordResetService.generatePasswordResetToken(email, otp);
  }

  public void resetPassword(String email, String resetToken, String newPassword) {
    // Validate inputs
    if (email == null || email.trim().isEmpty()) {
      throw new BadRequestException("Email is required");
    }
    if (resetToken == null || resetToken.trim().isEmpty()) {
      throw new BadRequestException("Reset token is required");
    }
    if (newPassword == null || newPassword.trim().isEmpty()) {
      throw new BadRequestException("New password is required");
    }

    // Validate JWT token
    if (!jwtPasswordResetService.isTokenValid(resetToken, email)) {
      throw new BadRequestException("Invalid or expired reset token");
    }

    User user = userRepository.findByEmail(email)
        .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

    String hashedPassword = passwordEncoder.encode(newPassword);
    user.setPassword(hashedPassword);
    userRepository.save(user);
  }
}

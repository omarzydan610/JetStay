package com.example.backend.service.AuthService;

import com.example.backend.entity.User;
import com.example.backend.entity.UserOtp;
import com.example.backend.repository.UserOtpRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.GenericEmailService;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class ForgetResetPasswordServiceTest {

  @TestConfiguration
  static class TestConfig {
    @Bean
    @Primary
    public GenericEmailService genericEmailService() {
      return mock(GenericEmailService.class);
    }
  }

  @Autowired
  private ForgetResetPasswordService forgetResetPasswordService;

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private UserOtpRepository userOtpRepository;

  @Autowired
  private PasswordEncoder passwordEncoder;

  @Autowired
  private JwtPassResetService jwtPassResetService;

  @Autowired
  private GenericEmailService emailService;

  @Autowired
  private EntityManager entityManager;

  private User testUser;

  @BeforeEach
  void setUp() {
    // Clean up
    userOtpRepository.deleteAll();
    userRepository.deleteAll();

    // Create test user
    testUser = new User();
    testUser.setEmail("integration.test@example.com");
    testUser.setFirstName("John");
    testUser.setLastName("Doe");
    testUser.setPhoneNumber("+1234567890");
    testUser.setPassword(passwordEncoder.encode("oldPassword123"));
    testUser.setStatus(User.UserStatus.ACTIVE);
    testUser = userRepository.save(testUser);
  }

  @Test
  void forgotPassword_Success_CreatesOtpAndSendsEmail() {
    // Arrange
    doNothing().when(emailService).sendEmail(anyString(), anyString(), anyString());

    // Act
    forgetResetPasswordService.forgotPassword(testUser.getEmail());

    // Assert
    Optional<UserOtp> savedOtp = userOtpRepository.findAll().stream()
        .filter(otp -> otp.getUser().getUserID().equals(testUser.getUserID()))
        .findFirst();

    assertTrue(savedOtp.isPresent(), "OTP should be saved in database");
    assertEquals(6, savedOtp.get().getOtp().length(), "OTP should be 6 digits");
    assertTrue(savedOtp.get().getExpireAt().isAfter(LocalDateTime.now()), "OTP should not be expired");

  }

  @Test
  void forgotPassword_EmailNull_ThrowsException() {
    // Act & Assert
    RuntimeException exception = assertThrows(RuntimeException.class,
        () -> forgetResetPasswordService.forgotPassword(null));
    assertEquals("Email is required", exception.getMessage());
  }

  @Test
  void forgotPassword_EmptyEmail_ThrowsException() {
    // Act & Assert
    RuntimeException exception = assertThrows(RuntimeException.class,
        () -> forgetResetPasswordService.forgotPassword("  "));
    assertEquals("Email is required", exception.getMessage());
  }

  @Test
  void forgotPassword_UserNotFound_ThrowsException() {
    // Act & Assert
    RuntimeException exception = assertThrows(RuntimeException.class,
        () -> forgetResetPasswordService.forgotPassword("nonexistent@example.com"));
    assertEquals("User not found with email: nonexistent@example.com", exception.getMessage());
  }

  @Test
  void forgotPassword_UserDeactivated_ThrowsException() {
    // Arrange
    testUser.setStatus(User.UserStatus.DEACTIVATED);
    userRepository.save(testUser);

    // Act & Assert
    RuntimeException exception = assertThrows(RuntimeException.class,
        () -> forgetResetPasswordService.forgotPassword(testUser.getEmail()));
    assertEquals("User account is deactivated", exception.getMessage());
  }

  @Test
  void forgotPassword_EmailSendingFails_DeletesOtp() {
    // Arrange
    doThrow(new RuntimeException("Email service error"))
        .when(emailService).sendEmail(anyString(), anyString(), anyString());

    // Act & Assert
    assertThrows(RuntimeException.class,
        () -> forgetResetPasswordService.forgotPassword(testUser.getEmail()));

    // Verify OTP was not saved (or was rolled back)
    long otpCount = userOtpRepository.findAll().stream()
        .filter(otp -> otp.getUser().getUserID().equals(testUser.getUserID()))
        .count();
    assertEquals(0, otpCount, "OTP should be deleted after email failure");
  }

  @Test
  void verifyOtp_Success_ReturnsValidJwtToken() {
    // Arrange
    doNothing().when(emailService).sendEmail(anyString(), anyString(), anyString());
    forgetResetPasswordService.forgotPassword(testUser.getEmail());

    UserOtp savedOtp = userOtpRepository.findAll().stream()
        .filter(otp -> otp.getUser().getUserID().equals(testUser.getUserID()))
        .findFirst()
        .orElseThrow();

    // Act
    String token = forgetResetPasswordService.verifyOtp(testUser.getEmail(), savedOtp.getOtp());

    // Assert
    assertNotNull(token, "Token should not be null");
    assertFalse(token.isEmpty(), "Token should not be empty");

    // Verify token is valid
    assertTrue(jwtPassResetService.isTokenValid(token, testUser.getEmail()), "Token should be valid");

    // Verify OTP was deleted after successful verification
    Optional<UserOtp> deletedOtp = userOtpRepository.findById(savedOtp.getOtpID());
    assertFalse(deletedOtp.isPresent(), "OTP should be deleted after verification");
  }

  @Test
  void verifyOtp_InvalidOtp_ThrowsException() {
    // Arrange
    doNothing().when(emailService).sendEmail(anyString(), anyString(), anyString());
    forgetResetPasswordService.forgotPassword(testUser.getEmail());

    UserOtp savedOtp = userOtpRepository.findAll().stream()
        .filter(otp -> otp.getUser().getUserID().equals(testUser.getUserID()))
        .findFirst()
        .orElseThrow();

    String WrongOtp = savedOtp.getOtp() + "1";

    // Act & Assert
    RuntimeException exception = assertThrows(RuntimeException.class,
        () -> forgetResetPasswordService.verifyOtp(testUser.getEmail(), WrongOtp));
    assertEquals("Invalid OTP", exception.getMessage());
  }

  @Test
  void verifyOtp_ExpiredOtp_ThrowsExceptionAndDeletesOtp() {
    // Arrange
    // Create OTP normally first to get an ID
    UserOtp expiredOtp = new UserOtp();
    expiredOtp.setUser(testUser);
    expiredOtp.setOtp("123456");
    expiredOtp = userOtpRepository.save(expiredOtp);

    // Use native SQL to update expiration to the past (bypass @PrePersist)
    entityManager.createNativeQuery(
        "UPDATE user_otp SET created_at = :createdAt, expire_at = :expireAt WHERE otp_id = :otpId")
        .setParameter("createdAt", LocalDateTime.now().minusMinutes(10))
        .setParameter("expireAt", LocalDateTime.now().minusMinutes(5))
        .setParameter("otpId", expiredOtp.getOtpID())
        .executeUpdate();

    // Flush and clear to ensure the update is committed and entity is reloaded
    entityManager.flush();
    entityManager.clear();


    // Act & Assert
    RuntimeException exception = assertThrows(RuntimeException.class,
        () -> forgetResetPasswordService.verifyOtp(testUser.getEmail(), "123456"));
    assertEquals("OTP has expired", exception.getMessage());

    // Verify expired OTP was deleted
    Optional<UserOtp> deletedOtp = userOtpRepository.findById(expiredOtp.getOtpID());
    assertFalse(deletedOtp.isPresent(), "Expired OTP should be deleted");
  }

  @Test
  void changePassword_Success_UpdatesPassword() {
    // Arrange
    doNothing().when(emailService).sendEmail(anyString(), anyString(), anyString());
    forgetResetPasswordService.forgotPassword(testUser.getEmail());

    UserOtp savedOtp = userOtpRepository.findAll().stream()
        .filter(otp -> otp.getUser().getUserID().equals(testUser.getUserID()))
        .findFirst()
        .orElseThrow();

    String token = forgetResetPasswordService.verifyOtp(testUser.getEmail(), savedOtp.getOtp());
    String newPassword = "newPassword456";

    // Act
    forgetResetPasswordService.changePassword(testUser.getEmail(), token, newPassword);

    // Assert
    User updatedUser = userRepository.findById(testUser.getUserID()).orElseThrow();
    assertTrue(passwordEncoder.matches(newPassword, updatedUser.getPassword()),
        "Password should be updated and properly encoded");
    assertFalse(passwordEncoder.matches("oldPassword123", updatedUser.getPassword()),
        "Old password should no longer match");
  }

  @Test
  void changePassword_InvalidToken_ThrowsException() {
    // Act & Assert
    RuntimeException exception = assertThrows(RuntimeException.class,
        () -> forgetResetPasswordService.changePassword(
            testUser.getEmail(),
            "invalid-token",
            "newPassword123"));
    assertEquals("Invalid or expired reset token", exception.getMessage());
  }

  @Test
  void changePassword_TokenForDifferentEmail_ThrowsException() {
    // Arrange
    doNothing().when(emailService).sendEmail(anyString(), anyString(), anyString());
    forgetResetPasswordService.forgotPassword(testUser.getEmail());

    UserOtp savedOtp = userOtpRepository.findAll().stream()
        .filter(otp -> otp.getUser().getUserID().equals(testUser.getUserID()))
        .findFirst()
        .orElseThrow();

    String token = forgetResetPasswordService.verifyOtp(testUser.getEmail(), savedOtp.getOtp());

    // Act & Assert
    RuntimeException exception = assertThrows(RuntimeException.class,
        () -> forgetResetPasswordService.changePassword(
            "different@example.com",
            token,
            "newPassword123"));
    assertEquals("Invalid or expired reset token", exception.getMessage());
  }

  @Test
  void completePasswordResetFlow_Success() {
    // Arrange
    doNothing().when(emailService).sendEmail(anyString(), anyString(), anyString());
    String newPassword = "brandNewPassword789";

    // Step 1: Request password reset
    forgetResetPasswordService.forgotPassword(testUser.getEmail());

    // Step 2: Get the OTP
    UserOtp savedOtp = userOtpRepository.findAll().stream()
        .filter(otp -> otp.getUser().getUserID().equals(testUser.getUserID()))
        .findFirst()
        .orElseThrow();

    // Step 3: Verify OTP and get token
    String token = forgetResetPasswordService.verifyOtp(testUser.getEmail(), savedOtp.getOtp());
    assertNotNull(token);

    // Step 4: Change password with token
    forgetResetPasswordService.changePassword(testUser.getEmail(), token, newPassword);

    // Assert: Verify complete flow
    User finalUser = userRepository.findById(testUser.getUserID()).orElseThrow();
    assertTrue(passwordEncoder.matches(newPassword, finalUser.getPassword()),
        "Complete flow should result in updated password");

    // Verify OTP is deleted
    long remainingOtps = userOtpRepository.findAll().stream()
        .filter(otp -> otp.getUser().getUserID().equals(testUser.getUserID()))
        .count();
    assertEquals(0, remainingOtps, "No OTPs should remain after successful password reset");
  }
}

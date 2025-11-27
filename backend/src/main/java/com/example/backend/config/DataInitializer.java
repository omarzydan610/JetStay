package com.example.backend.config;

import com.example.backend.entity.User;
import com.example.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

  private final UserRepository userRepository;
  private final PasswordEncoder encoder;

  @Override
  public void run(String... args) throws Exception {
    // Check if admin user already exists
    if (!userRepository.existsByEmail("jetstay@admin.com")) {
      User admin = new User();
      admin.setEmail("jetstay@admin.com");
      admin.setPassword(encoder.encode("jetstay1234"));
      admin.setFirstName("Admin");
      admin.setLastName("Admin");
      admin.setPhoneNumber("01011121314");
      admin.setRole(User.UserRole.SYSTEM_ADMIN);
      admin.setStatus(User.UserStatus.ACTIVE);

      userRepository.save(admin);
      System.out.println("✓ Default admin user created successfully!");
    } else {
      System.out.println("✓ Default admin user already exists.");
    }
  }
}

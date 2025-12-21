package com.example.backend.config;

import com.example.backend.entity.PaymentMethod;
import com.example.backend.entity.User;
import com.example.backend.repository.PaymentMethodRepository;
import com.example.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

  private final UserRepository userRepository;
  private final PaymentMethodRepository paymentMethodRepository;
  private final PasswordEncoder encoder;

  @Override
  public void run(String... args) throws Exception {

    // ----- Initialize admin user -----
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

    // ----- Initialize payment methods -----
    List<PaymentMethod> defaultMethods = Arrays.asList(
            new PaymentMethod(null, "CREDIT_CARD", 2.5f),
            new PaymentMethod(null, "PAYPAL", 3.0f),
            new PaymentMethod(null, "CASH", 0.0f)
    );

    for (PaymentMethod method : defaultMethods) {
      if (paymentMethodRepository.findByMethodName(method.getMethodName()).isEmpty()) {
        paymentMethodRepository.save(method);
        System.out.println("✓ Payment method " + method.getMethodName() + " created successfully!");
      } else {
        System.out.println("✓ Payment method " + method.getMethodName() + " already exists.");
      }
    }
  }
}
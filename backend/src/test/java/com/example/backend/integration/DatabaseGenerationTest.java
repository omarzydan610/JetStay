package com.example.backend.integration;

import com.example.backend.entity.*;
import com.example.backend.repository.*;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
public class DatabaseGenerationTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private HotelRepository hotelRepository;

    @Autowired
    private AirlineRepository airlineRepository;

    @Autowired
    private AirportRepository airportRepository;

    @Autowired
    private FlightRepository flightRepository;

    @Autowired
    private RoomTypeRepository roomTypeRepository;

    @Autowired
    private RoomImageRepository roomImageRepository;

    @Autowired
    private TripTypeRepository tripTypeRepository;

    @Autowired
    private HotelImageRepository hotelImageRepository;

    @Autowired
    private HotelAmenityRepository hotelAmenityRepository;

    @Autowired
    private UserOtpRepository userOtpRepository;

    @Test
    public void testAllTablesAreCreated() {
        // Verify all repositories exist
        assertThat(userRepository.count()).isGreaterThanOrEqualTo(1);
        assertThat(hotelRepository.count()).isGreaterThanOrEqualTo(0);
        assertThat(airlineRepository.count()).isGreaterThanOrEqualTo(0);
        assertThat(airportRepository.count()).isGreaterThanOrEqualTo(0);
        assertThat(flightRepository.count()).isGreaterThanOrEqualTo(0);
        assertThat(roomTypeRepository.count()).isGreaterThanOrEqualTo(0);
        assertThat(roomImageRepository.count()).isGreaterThanOrEqualTo(0);
        assertThat(tripTypeRepository.count()).isGreaterThanOrEqualTo(0);
        assertThat(hotelImageRepository.count()).isGreaterThanOrEqualTo(0);
        assertThat(hotelAmenityRepository.count()).isGreaterThanOrEqualTo(0);
        assertThat(userOtpRepository.count()).isGreaterThanOrEqualTo(0);
    }

    @Test
    public void testSystemAdminExists() {
        // Verify system admin user exists
        Optional<User> adminUser = userRepository.findByEmail("jetstay@admin.com");
        
        assertThat(adminUser).isPresent();
        
        User admin = adminUser.get();
        assertThat(admin.getEmail()).isEqualTo("jetstay@admin.com");
        assertThat(admin.getPassword()).isEqualTo("jetstay1234");
        assertThat(admin.getFirstName()).isEqualTo("Admin");
        assertThat(admin.getLastName()).isEqualTo("Admin");
        assertThat(admin.getPhoneNumber()).isEqualTo("01011121314");
        assertThat(admin.getRole()).isEqualTo(User.UserRole.SYSTEM_ADMIN);
        assertThat(admin.getStatus()).isEqualTo(User.UserStatus.ACTIVE);
        assertThat(admin.getCreatedAt()).isNotNull();
    }
}

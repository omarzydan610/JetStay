package com.example.backend.service.Partnership;

import com.example.backend.dto.PartnershipRequist.HotelPartnershipRequest;
import com.example.backend.dto.PartnershipRequist.HotelPartnershipResponse;
import com.example.backend.entity.Hotel;
import com.example.backend.entity.User;
import com.example.backend.repository.HotelRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.time.LocalDateTime;

@Service
@Transactional
public class HotelPartnershipService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private HotelRepository hotelRepository;

    @Autowired
    private FileStorageService fileStorageService;


    public String submitHotelPartnership(HotelPartnershipRequest request) throws IOException {
        // Check if user email already exists
        if (userRepository.existsByEmail(request.getManagerEmail())) {
            throw new IllegalArgumentException("Manager email already exists: " + request.getManagerEmail());
        }

        // Create User entity for hotel admin
        User hotelAdmin = new User();
        hotelAdmin.setFirstName(request.getAdminFirstName());
        hotelAdmin.setLastName(request.getAdminLastName());
        hotelAdmin.setEmail(request.getManagerEmail());
        hotelAdmin.setPassword(request.getManagerPassword());
        hotelAdmin.setPhoneNumber(request.getAdminPhone());
        hotelAdmin.setRole(User.UserRole.HOTEL_ADMIN);
        hotelAdmin.setStatus(User.UserStatus.ACTIVE);
        
        User savedAdmin = userRepository.save(hotelAdmin);
        
        // Store hotel logo if provided
        String logoPath = null;
        if (request.getHotelLogo() != null && !request.getHotelLogo().isEmpty()) {
            logoPath = fileStorageService.storeFile(request.getHotelLogo());
        }
        
        // Create Hotel entity
        Hotel hotel = new Hotel();
        hotel.setHotelName(request.getHotelName());
        hotel.setLatitude(request.getLatitude());
        hotel.setLongitude(request.getLongitude());
        hotel.setCity(request.getCity());
        hotel.setCountry(request.getCountry());
        hotel.setAdmin(savedAdmin);
        hotel.setHotelRate(0.0f);
        hotel.setNumberOfRates(0);
        hotel.setLogoUrl(logoPath);
        hotel.setCreatedAt(LocalDateTime.now());
        hotel.setStatus(Hotel.Status.INACTIVE);

        Hotel savedHotel = hotelRepository.save(hotel);

        // Prepare response
        String response = "Hotel partnership request submitted successfully with ID: " + savedHotel.getHotelID();

        return response;
    }
}
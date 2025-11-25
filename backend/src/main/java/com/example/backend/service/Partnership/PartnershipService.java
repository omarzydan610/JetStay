package com.example.backend.service.Partnership;

import com.example.backend.dto.PartnershipRequist.AirlinePartnershipRequest;
import com.example.backend.dto.PartnershipRequist.HotelPartnershipRequest;
import com.example.backend.entity.Airline;
import com.example.backend.entity.Hotel;
import com.example.backend.entity.User;
import com.example.backend.repository.AirlineRepository;
import com.example.backend.repository.HotelRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.time.LocalDateTime;

@Service
@Transactional
public class PartnershipService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AirlineRepository airlineRepository;

    @Autowired
    private HotelRepository hotelRepository;

    @Autowired
    private FileStorageService fileStorageService;

    // Airline flow
    public String submitAirlinePartnership(AirlinePartnershipRequest request) throws IOException {
        // validations moved here
        if (request == null)
            throw new IllegalArgumentException("Request cannot be null");
        if (request.getManagerEmail() == null || request.getManagerEmail().isBlank())
            throw new IllegalArgumentException("Manager email is required");
        if (request.getAirlineName() == null || request.getAirlineName().isBlank())
            throw new IllegalArgumentException("Airline name is required");

        if (userRepository.existsByEmail(request.getManagerEmail())) {
            throw new IllegalArgumentException("Manager email already exists: " + request.getManagerEmail());
        }

        if (airlineRepository.existsByAirlineName(request.getAirlineName())) {
            throw new IllegalArgumentException("Airline name already exists: " + request.getAirlineName());
        }

        User airlineAdmin = new User();
        airlineAdmin.setFirstName(request.getAdminFirstName());
        airlineAdmin.setLastName(request.getAdminLastName());
        airlineAdmin.setEmail(request.getManagerEmail());
        airlineAdmin.setPassword(request.getManagerPassword());
        airlineAdmin.setPhoneNumber(request.getAdminPhone());
        airlineAdmin.setRole(User.UserRole.AIRLINE_ADMIN);
        airlineAdmin.setStatus(User.UserStatus.ACTIVE);

        User savedAdmin = userRepository.save(airlineAdmin);

        String logoPath = null;
        if (request.getAirlineLogo() != null && !request.getAirlineLogo().isEmpty()) {
            logoPath = fileStorageService.storeFile(request.getAirlineLogo());
        }

        Airline airline = new Airline();
        airline.setAirlineName(request.getAirlineName());
        airline.setAirlineNationality(request.getAirlineNationality());
        airline.setAdmin(savedAdmin);
        airline.setAirlineRate(0.0f);
        airline.setNumberOfRates(0);
        airline.setLogoUrl(logoPath);
        airline.setStatus(Airline.Status.INACTIVE);
        airline.setCreatedAt(LocalDateTime.now());

        Airline savedAirline = airlineRepository.save(airline);

        return "Airline partnership request submitted successfully with ID: " + savedAirline.getAirlineID();
    }

    // Hotel flow
    public String submitHotelPartnership(HotelPartnershipRequest request) throws IOException {
        if (request == null)
            throw new IllegalArgumentException("Request cannot be null");
        if (request.getManagerEmail() == null || request.getManagerEmail().isBlank())
            throw new IllegalArgumentException("Manager email is required");
        if (request.getHotelName() == null || request.getHotelName().isBlank())
            throw new IllegalArgumentException("Hotel name is required");

        if (userRepository.existsByEmail(request.getManagerEmail())) {
            throw new IllegalArgumentException("Manager email already exists: " + request.getManagerEmail());
        }

        User hotelAdmin = new User();
        hotelAdmin.setFirstName(request.getAdminFirstName());
        hotelAdmin.setLastName(request.getAdminLastName());
        hotelAdmin.setEmail(request.getManagerEmail());
        hotelAdmin.setPassword(request.getManagerPassword());
        hotelAdmin.setPhoneNumber(request.getAdminPhone());
        hotelAdmin.setRole(User.UserRole.HOTEL_ADMIN);
        hotelAdmin.setStatus(User.UserStatus.ACTIVE);

        User savedAdmin = userRepository.save(hotelAdmin);

        String logoPath = null;
        if (request.getHotelLogo() != null && !request.getHotelLogo().isEmpty()) {
            logoPath = fileStorageService.storeFile(request.getHotelLogo());
        }

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

        return "Hotel partnership request submitted successfully with ID: " + savedHotel.getHotelID();
    }
}

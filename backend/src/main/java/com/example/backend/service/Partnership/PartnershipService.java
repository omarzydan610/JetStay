package com.example.backend.service.Partnership;

import com.example.backend.dto.AuthDTO.UserDTO;
import com.example.backend.dto.PartnershipRequist.AirlinePartnershipRequest;
import com.example.backend.dto.PartnershipRequist.HotelPartnershipRequest;
import com.example.backend.entity.Airline;
import com.example.backend.entity.Hotel;
import com.example.backend.entity.User;
import com.example.backend.exception.BadRequestException;
import com.example.backend.exception.InternalServerErrorException;
import com.example.backend.mapper.AirlineCreatorMapper;
import com.example.backend.mapper.HotelCreatorMapper;
import com.example.backend.repository.AirlineRepository;
import com.example.backend.repository.HotelRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.AuthService.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;


@Service
@Transactional
public class PartnershipService {

    @Autowired
    private AirlineCreatorMapper airlineMapper;

    @Autowired
    private HotelCreatorMapper hotelMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AirlineRepository airlineRepository;

    @Autowired
    private HotelRepository hotelRepository;

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private AuthService authService;

    // Airline flow
    public void submitAirlinePartnership(AirlinePartnershipRequest request) {
        // validations moved here
        if (request == null)
            throw new BadRequestException("Request cannot be null");
        if (request.getManagerEmail() == null || request.getManagerEmail().isBlank())
            throw new BadRequestException("Manager email is required");
        if (request.getAirlineName() == null || request.getAirlineName().isBlank())
            throw new BadRequestException("Airline name is required");
        if (userRepository.existsByEmail(request.getManagerEmail())) {
            throw new BadRequestException("Manager email already exists: " + request.getManagerEmail());
        }
        if (airlineRepository.existsByAirlineName(request.getAirlineName())) {
            throw new BadRequestException("Airline name already exists: " + request.getAirlineName());
        }

        // Create and save admin user using AuthService
        UserDTO airlineAdmin = new UserDTO(request.getAdminFirstName(),
                request.getAdminLastName(),
                request.getManagerEmail(),
                request.getManagerPassword(),
                request.getAdminPhone());

        // Use AuthService to sign up the admin
        authService.SignUp(airlineAdmin, User.UserRole.AIRLINE_ADMIN);

        User savedAdmin = userRepository.findByEmail(request.getManagerEmail())
                .orElseThrow(() -> new InternalServerErrorException("Failed to retrieve saved admin user"));

        String logoPath = null;
        if (request.getAirlineLogo() != null && !request.getAirlineLogo().isEmpty()) {
            try {
                logoPath = fileStorageService.storeFile(request.getAirlineLogo());
            } catch (IOException e) {
                throw new InternalServerErrorException("Failed to store airline logo", e);
            }
        }

        Airline airline = airlineMapper.createAirline(request.getAirlineName(), request.getAirlineNationality(),
                savedAdmin, logoPath);

        airlineRepository.save(airline);
    }

    // Hotel flow
    public void submitHotelPartnership(HotelPartnershipRequest request) {
        if (request == null)
            throw new BadRequestException("Request cannot be null");
        if (request.getManagerEmail() == null || request.getManagerEmail().isBlank())
            throw new BadRequestException("Manager email is required");
        if (request.getHotelName() == null || request.getHotelName().isBlank())
            throw new BadRequestException("Hotel name is required");

        if (userRepository.existsByEmail(request.getManagerEmail())) {
            throw new BadRequestException("Manager email already exists: " + request.getManagerEmail());
        }

        UserDTO hotelAdmin = new UserDTO(
                request.getAdminFirstName(),
                request.getAdminLastName(),
                request.getManagerEmail(),
                request.getManagerPassword(),
                request.getAdminPhone());

        authService.SignUp(hotelAdmin, User.UserRole.HOTEL_ADMIN);

        User savedAdmin = userRepository.findByEmail(request.getManagerEmail())
                .orElseThrow(() -> new InternalServerErrorException("Failed to retrieve saved admin user"));

        String logoPath = null;
        if (request.getHotelLogo() != null && !request.getHotelLogo().isEmpty()) {
            try {
                logoPath = fileStorageService.storeFile(request.getHotelLogo());
            } catch (IOException e) {
                throw new InternalServerErrorException("Failed to store hotel logo", e);
            }
        }
        
        Hotel hotel = hotelMapper.createHotel(request.getHotelName(), request.getLatitude(), request.getLongitude(),
                request.getCity(), request.getCountry(), savedAdmin, logoPath);

        hotelRepository.save(hotel);
    }
}

package com.example.backend.service.SystemAdminService;

import com.example.backend.entity.Airline;
import com.example.backend.entity.Hotel;
import com.example.backend.entity.User;
import com.example.backend.exception.BadRequestException;
import com.example.backend.exception.InternalServerErrorException;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.AirlineRepository;
import com.example.backend.repository.HotelRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.GenericEmailService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.stream.Collectors;

@Service
public class ChangeAccountStatus {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AirlineRepository airlineRepository;

    @Autowired
    private HotelRepository hotelRepository;

    @Autowired
    private GenericEmailService emailService;

    @Transactional
    public void activateUser(String email){

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        if (user.getStatus() == User.UserStatus.ACTIVE) {
            throw new BadRequestException("User account is already activated !");
        }

        user.setStatus(User.UserStatus.ACTIVE);
        userRepository.save(user);   // rollback if send email fails

        // Notify user
        try {
            String html = loadEmailTemplate("status_activate.html", user.getFirstName(), "User Account", null);
            emailService.sendEmail(user.getEmail(), "Your JetStay Account Has Been Activated", html);
        } catch (Exception e) {
            throw new InternalServerErrorException("Failed to send activation email: " + e.getMessage(), e);
        }
    }

    @Transactional
    public void deactivateUser(String email, String reason){

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        if (user.getStatus() == User.UserStatus.DEACTIVATED) {
            throw new BadRequestException("User account is already deactivated !");
        }

        user.setStatus(User.UserStatus.DEACTIVATED);
        userRepository.save(user);   // rollback if send email fails

        // Notify user
        try {
            String html = loadEmailTemplate("status_deactivate.html", user.getFirstName(), "User Account", reason);
            emailService.sendEmail(user.getEmail(), "Your JetStay Account Has Been Deactivated !!", html);
        } catch (Exception e) {
            throw new InternalServerErrorException("Failed to send deactivation email: " + e.getMessage(), e);
        }
    }

    @Transactional
    public void activateAirline(int airlineID){

        Airline airline = airlineRepository.findByAirlineID(airlineID)
                .orElseThrow(() -> new ResourceNotFoundException("Airline not found with id"+ airlineID));
        if (airline.getStatus() == Airline.Status.ACTIVE){
            throw new BadRequestException("Airline is already activated !");
        }

        airline.setStatus(Airline.Status.ACTIVE);
        airlineRepository.save(airline);    // rollback if send email fails
        User admin = airlineRepository.findAdminByAirlineID(airlineID)
                .orElseThrow(() -> new ResourceNotFoundException("Admin of this Airline not found "+ airlineID));

        // Notify user
        try {
            String html = loadEmailTemplate("status_activate.html", admin.getFirstName(), "Airline", null);
            emailService.sendEmail(admin.getEmail(), "Your Airline Has Been Activated", html);
        } catch (Exception e) {
            throw new InternalServerErrorException("Failed to send activation email: " + e.getMessage(), e);
        }
    }

    @Transactional
    public void deactivateAirline(int airlineID, String reason){

        Airline airline = airlineRepository.findByAirlineID(airlineID)
                .orElseThrow(() -> new ResourceNotFoundException("Airline not found with id"+ airlineID));
        if (airline.getStatus() == Airline.Status.INACTIVE){
            throw new BadRequestException("Airline is already deactivated !");
        }

        airline.setStatus(Airline.Status.INACTIVE);
        airlineRepository.save(airline);    // rollback if send email fails
        User admin = airlineRepository.findAdminByAirlineID(airlineID)
                .orElseThrow(() -> new ResourceNotFoundException("Admin of this Airline not found "+ airlineID));

        // Notify user
        try {
            String html = loadEmailTemplate("status_deactivate.html", admin.getFirstName(), "Airline", reason);
            emailService.sendEmail(admin.getEmail(), "Your Airline Has Been Deactivated", html);
        } catch (Exception e) {
            throw new InternalServerErrorException("Failed to send deactivation email: " + e.getMessage(), e);
        }
    }

    @Transactional
    public void activateHotel(int hotelID){

        Hotel hotel = hotelRepository.findByHotelID(hotelID)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found with id"+ hotelID));
        if (hotel.getStatus() == Hotel.Status.ACTIVE){
            throw new BadRequestException("Hotel is already activated !");
        }

        hotel.setStatus(Hotel.Status.ACTIVE);
        hotelRepository.save(hotel);        // rollback if send email fails
        User admin = hotelRepository.findAdminByHotelID(hotelID)
                .orElseThrow(() -> new ResourceNotFoundException("Admin of this Hotel not found "+ hotelID));

        // Notify user
        try {
            String html = loadEmailTemplate("status_activate.html", admin.getFirstName(), "Hotel", null);
            emailService.sendEmail(admin.getEmail(), "Your Hotel Has Been Activated", html);
        } catch (Exception e) {
            throw new InternalServerErrorException("Failed to send activation email: " + e.getMessage(), e);
        }
    }

    @Transactional
    public void deactivateHotel(int hotelID, String reason){

        Hotel hotel = hotelRepository.findByHotelID(hotelID)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found with id"+ hotelID));
        if (hotel.getStatus() == Hotel.Status.INACTIVE){
            throw new BadRequestException("Hotel is already deactivated !");
        }

        hotel.setStatus(Hotel.Status.INACTIVE);
        hotelRepository.save(hotel);        // rollback if send email fails
        User admin = hotelRepository.findAdminByHotelID(hotelID)
                .orElseThrow(() -> new ResourceNotFoundException("Admin of this Hotel not found "+ hotelID));

        // Notify user
        try {
            String html = loadEmailTemplate("status_deactivate.html", admin.getFirstName(), "Hotel", reason);
            emailService.sendEmail(admin.getEmail(), "Your Hotel Has Been Deactivated", html);
        } catch (Exception e) {
            throw new InternalServerErrorException("Failed to send deactivation email: " + e.getMessage(), e);
        }
    }

    private String loadEmailTemplate(String fileName, String name, String type, String reason) throws Exception {
        ClassPathResource resource = new ClassPathResource("template/" + fileName);
        String template;

        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8))) {
            template = reader.lines().collect(Collectors.joining("\n"));
        }

        template = template.replace("${name}", name);
        template = template.replace("${type}", type);
        template = template.replace("${year}", String.valueOf(java.time.Year.now().getValue()));

        if (reason != null) {
            template = template.replace("${reason}", reason);
        } else {
            template = template.replace("${reason}", "");
        }

        return template;
    }
}

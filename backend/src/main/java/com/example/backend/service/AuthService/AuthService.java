package com.example.backend.service.AuthService;

import com.example.backend.dto.AuthDTO.LoginDTO;
import com.example.backend.dto.AuthDTO.UserDTO;
import com.example.backend.entity.Airline;
import com.example.backend.entity.Hotel;
import com.example.backend.exception.BadRequestException;
import com.example.backend.exception.InternalServerErrorException;
import com.example.backend.entity.User;
import com.example.backend.exception.UnauthorizedException;
import com.example.backend.mapper.UserMapper;
import com.example.backend.repository.AirlineRepository;
import com.example.backend.repository.HotelRepository;
import com.example.backend.repository.UserRepository;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class AuthService {

    @Value("${google.client.id}")
    private String googleClientId;

    private final PasswordEncoder encoder;
    private final UserRepository userRepository;
    private final HotelRepository hotelRepository;
    private final AirlineRepository airlineRepository;
    private final UserMapper userMapper;
    private final AuthenticationManager authenticationManager;
    private final JwtAuthService jwtAuthService;

    public AuthService(PasswordEncoder encoder, UserRepository userRepository, AuthenticationManager authenticationManager, JwtAuthService jwtAuthService, HotelRepository hotelRepository, AirlineRepository airlineRepository) {
        this.encoder = encoder;
        this.userRepository = userRepository;
        this.userMapper = new UserMapper();
        this.authenticationManager = authenticationManager;
        this.jwtAuthService = jwtAuthService;
        this.hotelRepository = hotelRepository;
        this.airlineRepository = airlineRepository;
    }

    public void SignUp(UserDTO newuser) {
        SignUp(newuser, User.UserRole.CLIENT);
    }

    public void SignUp(UserDTO newuser, User.UserRole userRole) {
        Optional<User> existingUser = userRepository.findByEmail(newuser.getEmail());

        if (existingUser.isPresent()) {
            throw new BadRequestException("Email is already exists");
        }

        try {
            newuser.setPassword(encoder.encode(newuser.getPassword()));
            User user = userMapper.signupToUser(newuser, userRole);
            userRepository.save(user);

        } catch (Exception e) {
            throw new InternalServerErrorException("An unexpected error occurred", e);
        }
    }

    public String Login(LoginDTO loginDTO) {

        User user = userRepository.findByEmail(loginDTO.getEmail())
                .orElseThrow(() -> new UnauthorizedException("User does not exist"));

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginDTO.getEmail(),
                            loginDTO.getPassword()
                    )
            );
        } catch (AuthenticationException e) {
            throw new UnauthorizedException("Invalid email or password");
        }

        Integer managedId = null;

        if (user.getRole() == User.UserRole.HOTEL_ADMIN) {
            Hotel hotels = hotelRepository.findByAdminUserID(user.getUserID());
            managedId = hotels.getHotelID();
        } else if (user.getRole() == User.UserRole.AIRLINE_ADMIN) {
            Airline airlines = airlineRepository.findByAdminUserID(user.getUserID());
            managedId = airlines.getAirlineID();
        }

        String token = jwtAuthService.generateAuthToken(user, managedId);

        return token;
    }

    public String Googlelogin(String googleToken) {

        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    GoogleNetHttpTransport.newTrustedTransport(),
                    GsonFactory.getDefaultInstance()
            )
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();

            GoogleIdToken idToken = verifier.verify(googleToken);
            if (idToken == null) {
                throw new UnauthorizedException("Invalid Google token");
            }

            GoogleIdToken.Payload payload = idToken.getPayload();
            String email = payload.getEmail();
            String fname = (String) payload.get("given_name");
            String lname = (String) payload.get("family_name");

            // Check if user exists, otherwise create
            User user = userRepository.findByEmail(email)
                    .orElseGet(() -> {
                        User newUser = new User();
                        newUser.setEmail(email);
                        newUser.setFirstName(fname);
                        newUser.setLastName(lname);
                        newUser.setPassword(" ");
                        newUser.setPhoneNumber("+20");   //Google token doesn't include phone number
                        newUser.setRole(User.UserRole.CLIENT);
                        return userRepository.save(newUser);
                    });

            return jwtAuthService.generateAuthToken(user, null);

        } catch (Exception e) {
            throw new UnauthorizedException("Google login failed: " + e.getMessage());
        }
    }
}
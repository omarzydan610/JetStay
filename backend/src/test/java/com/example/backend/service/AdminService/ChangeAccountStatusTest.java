package com.example.backend.service.AdminService;

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
import com.example.backend.service.SystemAdminService.ChangeAccountStatus;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ChangeAccountStatusTest {

    @InjectMocks
    @Spy       //needed to mock loadEmailTemplate()
    private ChangeAccountStatus changeAccountStatus;

    @Mock
    private UserRepository userRepository;
    @Mock
    private AirlineRepository airlineRepository;
    @Mock
    private HotelRepository hotelRepository;
    @Mock
    private GenericEmailService emailService;

    @Test
    void activateUser_ShouldActivateAndSendEmail() throws Exception {
        User user = new User();
        user.setEmail("test@mail.com");
        user.setFirstName("Menan");
        user.setStatus(User.UserStatus.DEACTIVATED);

        when(userRepository.findByEmail("test@mail.com")).thenReturn(Optional.of(user));
        doReturn("<html>").when(changeAccountStatus)
                .loadEmailTemplate(anyString(), anyString(), anyString(), any());

        changeAccountStatus.activateUser("test@mail.com");

        assertEquals(User.UserStatus.ACTIVE, user.getStatus());
        verify(userRepository, times(1)).save(user);
        verify(emailService, times(1)).sendEmail(eq("test@mail.com"), anyString(), anyString());
    }

    @Test
    void activateUser_EmailFails_ShouldThrowAndRollback() throws Exception {
        User user = new User();
        user.setEmail("test@mail.com");
        user.setStatus(User.UserStatus.DEACTIVATED);
        user.setFirstName(null); // important because method uses it!

        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(user));

        doReturn("<html>").when(changeAccountStatus)
                .loadEmailTemplate(anyString(), any(), anyString(), any());

        doThrow(new RuntimeException("SMTP fail")).when(emailService)
                .sendEmail(anyString(), anyString(), anyString());

        assertThrows(InternalServerErrorException.class,
                () -> changeAccountStatus.activateUser("test@mail.com"));

        // Save must have been attempted (rollback later)
        verify(userRepository, times(1)).save(user);

        // Email must have been attempted
        verify(emailService, times(1)).sendEmail(anyString(), anyString(), anyString());
    }



    @Test
    void activateUser_AlreadyActive_ShouldThrow() {
        User user = new User();
        user.setEmail("test@mail.com");
        user.setStatus(User.UserStatus.ACTIVE);

        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(user));

        assertThrows(BadRequestException.class, () -> changeAccountStatus.activateUser("test@mail.com"));
    }

    @Test
    void activateUser_NotFound_ShouldThrow() {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> changeAccountStatus.activateUser("x@mail.com"));
    }

    @Test
    void activateAirline_ShouldActivateAndEmailAdmin() throws Exception {
        Airline a = new Airline(); a.setStatus(Airline.Status.INACTIVE);
        User admin = new User(); admin.setEmail("a@mail.com");

        when(airlineRepository.findByAirlineID(1)).thenReturn(Optional.of(a));
        when(airlineRepository.findAdminByAirlineID(1)).thenReturn(Optional.of(admin));
        doReturn("TEMPLATE").when(changeAccountStatus)
                .loadEmailTemplate(anyString(), any(), anyString(), any());


        changeAccountStatus.activateAirline(1);

        assertEquals(Airline.Status.ACTIVE, a.getStatus());
        verify(airlineRepository, times(1)).save(a);
        verify(emailService, times(1)).sendEmail(eq("a@mail.com"), anyString(), anyString());
    }

    @Test
    void activateAirline_NoAdmin_ShouldThrow() {
        Airline a = new Airline(); a.setStatus(Airline.Status.INACTIVE);

        when(airlineRepository.findByAirlineID(1)).thenReturn(Optional.of(a));
        when(airlineRepository.findAdminByAirlineID(1)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> changeAccountStatus.activateAirline(1));
    }

    @Test
    void activateAirline_AlreadyActive_ShouldThrow() {
        Airline a = new Airline(); a.setStatus(Airline.Status.ACTIVE);
        when(airlineRepository.findByAirlineID(1)).thenReturn(Optional.of(a));

        assertThrows(BadRequestException.class, () -> changeAccountStatus.activateAirline(1));
    }

    @Test
    void deactivateHotel_ShouldDeactivateAndSendEmail() throws Exception {
        Hotel h = new Hotel(); h.setStatus(Hotel.Status.ACTIVE);
        User admin = new User(); admin.setEmail("h@mail.com");

        when(hotelRepository.findByHotelID(1)).thenReturn(Optional.of(h));
        when(hotelRepository.findAdminByHotelID(1)).thenReturn(Optional.of(admin));
        doReturn("TEMPLATE").when(changeAccountStatus)
                .loadEmailTemplate(anyString(), any(), anyString(), any());


        changeAccountStatus.deactivateHotel(1, "Violation");

        assertEquals(Hotel.Status.INACTIVE, h.getStatus());
        verify(hotelRepository, times(1)).save(h);
        verify(emailService, times(1)).sendEmail(eq("h@mail.com"), anyString(), anyString());
    }

    @Test
    void deactivateHotel_AlreadyInactive_ShouldThrow() {
        Hotel h = new Hotel(); h.setStatus(Hotel.Status.INACTIVE);
        when(hotelRepository.findByHotelID(1)).thenReturn(Optional.of(h));

        assertThrows(BadRequestException.class, () -> changeAccountStatus.deactivateHotel(1, "x"));
    }



}

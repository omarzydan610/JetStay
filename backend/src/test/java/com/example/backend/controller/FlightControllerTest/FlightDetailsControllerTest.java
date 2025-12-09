package com.example.backend.controller.FlightControllerTest;

import com.example.backend.controller.TestSecurityConfig;
import com.example.backend.controller.AirlineController.FlightController;
import com.example.backend.dto.AirlineDTO.FlightDetailsDTO;
import com.example.backend.entity.Flight;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.service.AuthService.JwtAuthService;
import com.example.backend.service.AirlineService.FlightService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;
import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@Import(TestSecurityConfig.class)
@WebMvcTest(controllers = FlightController.class)
//@Import(FlightController.class)
public class FlightDetailsControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private FlightService flightService;

    @MockBean
    private JwtAuthService jwtAuthService;

    @Test
    public void testGetFlightDetailsSuccess() throws Exception {
        // Prepare mock DTO response
        FlightDetailsDTO dto = new FlightDetailsDTO();
        dto.setDepartureDate(LocalDateTime.parse("2025-01-01T10:00"));
        dto.setArrivalDate(LocalDateTime.parse("2025-01-01T12:00"));
        dto.setStatus(Flight.FlightStatus.ON_TIME);
        dto.setDepartureAirportName("Cairo International Airport");
        dto.setArrivalAirportName("Dubai International Airport");
        dto.setPlaneType("Boeing 737");

        List<FlightDetailsDTO> responseList = List.of(dto);

        // Mock service behavior
        when(flightService.getFlightDetails(10)).thenReturn(responseList);

        // Perform test request
        mockMvc.perform(get("/api/flight/details/10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Flight Details retrieved successfully"))
                .andExpect(jsonPath("$.data[0].planeType").value("Boeing 737"));
    }

    @Test
    public void testGetFlightDetailsNotFound() throws Exception {
        // Mock throwing exception
        when(flightService.getFlightDetails(99))
                .thenThrow(new ResourceNotFoundException("Flight not found with id: 99"));

        mockMvc.perform(get("/api/flight/details/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Flight not found with id: 99"));
    }
}

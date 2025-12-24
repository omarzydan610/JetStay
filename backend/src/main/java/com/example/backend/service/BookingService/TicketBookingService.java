package com.example.backend.service.BookingService;

import com.example.backend.exception.BadRequestException;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.backend.dto.BookingDTOs.TicketBookingRequest;
import com.example.backend.entity.User;
import com.example.backend.entity.Flight;
import com.example.backend.entity.FlightTicket;
import com.example.backend.entity.TripType;
import com.example.backend.repository.FlightTicketRepository;
import com.example.backend.repository.TripTypeRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.repository.FlightRepository;

@Service
public class TicketBookingService {
    @Autowired
    private FlightTicketRepository flightTicketRepository;

    @Autowired
    private FlightRepository flightRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TripTypeRepository tripTypeRepository;

    

    @Transactional
    public Integer[] ticketBookingService(TicketBookingRequest ticketBookingRequest, Integer userId) {
        User user = userRepository.getByUserID(userId);
        Flight flight = flightRepository.getByFlightID(ticketBookingRequest.getFlightId());
        TripType tripTypeEntity = tripTypeRepository.lockTripTypeById(ticketBookingRequest.getTripTypeId());
        long bookedTickets = flightTicketRepository.getNoOFBookedTickets(ticketBookingRequest.getTripTypeId());
        long availableTickets = tripTypeEntity.getQuantity() - bookedTickets;
        
        if (availableTickets < ticketBookingRequest.getQuantity()) {
            throw new BadRequestException("Not enough tickets available");
        }
        Integer[] ticketIds = new Integer[ticketBookingRequest.getQuantity()];
        for (int i = 0; i < ticketBookingRequest.getQuantity(); i++) {
            ticketIds[i] = getFlightTicket(user, flight, tripTypeEntity);
        }
        return ticketIds;
    }

    private Integer getFlightTicket(User user, Flight flight, TripType tripTypeEntity) {
        FlightTicket flightTicket = new FlightTicket();
        flightTicket.setFlight(flight);
        flightTicket.setAirline(flight.getAirline());
        flightTicket.setFlightDate(flight.getDepartureDate().toLocalDate());
        flightTicket.setUser(user);
        flightTicket.setTripType(tripTypeEntity);
        flightTicket.setPrice(tripTypeEntity.getPrice());
        flightTicket.setAppliedOffer(null);
        flightTicketRepository.save(flightTicket);
        return flightTicket.getTicketId();
    }

}

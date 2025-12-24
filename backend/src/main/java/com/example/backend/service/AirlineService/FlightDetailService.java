package com.example.backend.service.AirlineService;

import com.example.backend.dto.AirlineDTO.FlightsDataRequestDTO;
import com.example.backend.dto.AirlineDTO.FlightOfferResponse;
import com.example.backend.entity.Airline;
import com.example.backend.entity.Flight;
import com.example.backend.entity.FlightOffer;
import com.example.backend.exception.UnauthorizedException;
import com.example.backend.repository.AirlineRepository;
import com.example.backend.repository.FlightRepository;
import com.example.backend.repository.FlightOfferRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FlightDetailService {

    private final FlightRepository flightRepository;
    private final AirlineRepository airlineRepository;
    private final FlightOfferRepository flightOfferRepository;

    public FlightDetailService(FlightRepository flightRepository, 
                               AirlineRepository airlineRepository,
                               FlightOfferRepository flightOfferRepository) {
        this.flightRepository = flightRepository;
        this.airlineRepository = airlineRepository;
        this.flightOfferRepository = flightOfferRepository;
    }

    public List<FlightsDataRequestDTO> getFlightsByAirlineID(int airlineID) {
        Airline airline = airlineRepository.findById(airlineID).orElse(null);

        if (airline == null) {
            throw new UnauthorizedException("Airline not found for the given ID: " + airlineID);
        }

        List<Flight> flights = flightRepository.findByAirline_AirlineID(airline.getAirlineID());

        return flights.stream()
                .map(flight -> {
                    List<FlightOffer> offers = flightOfferRepository.findByApplicableFlight_FlightID(flight.getFlightID());
                    
                    List<FlightOfferResponse> offerResponses = offers.stream()
                            .map(this::mapToOfferResponse)
                            .collect(Collectors.toList());
                    
                    return new FlightsDataRequestDTO.Builder()
                            .flightId(flight.getFlightID())
                            .airlineId(flight.getAirline().getAirlineID())
                            .departureAirport(flight.getDepartureAirport().getAirportName())
                            .arrivalAirport(flight.getArrivalAirport().getAirportName())
                            .departureDate(flight.getDepartureDate())
                            .arrivalDate(flight.getArrivalDate())
                            .status(flight.getStatus().name())
                            .description(flight.getDescription())
                            .planeType(flight.getPlaneType())
                            .offers(offerResponses)
                            .build();
                })
                .collect(Collectors.toList());

    }
    
    private FlightOfferResponse mapToOfferResponse(FlightOffer offer) {
        FlightOfferResponse response = new FlightOfferResponse();
        response.setFlightOfferId(offer.getFlightOfferId());
        response.setOfferName(offer.getOfferName());
        response.setDiscountValue(offer.getDiscountValue());
        response.setStartDate(offer.getStartDate());
        response.setEndDate(offer.getEndDate());
        response.setMaxUsage(offer.getMaxUsage());
        response.setCurrentUsage(offer.getCurrentUsage());
        response.setIsActive(offer.getIsActive());
        response.setDescription(offer.getDescription());
        response.setCreatedAt(offer.getCreatedAt());
        return response;
    }
}
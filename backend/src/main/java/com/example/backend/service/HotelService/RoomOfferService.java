package com.example.backend.service.HotelService;

import com.example.backend.dto.HotelDTO.RoomOfferRequest;
import com.example.backend.dto.HotelDTO.RoomOfferResponse;
import com.example.backend.entity.RoomOffer;
import com.example.backend.entity.RoomType;
import com.example.backend.entity.Hotel;
import com.example.backend.repository.RoomOfferRepository;
import com.example.backend.repository.RoomTypeRepository;
import com.example.backend.repository.HotelRepository;
import com.example.backend.mapper.RoomOfferMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RoomOfferService {

    @Autowired
    private RoomOfferRepository roomOfferRepository;

    @Autowired
    private RoomTypeRepository roomTypeRepository;

    @Autowired
    private HotelRepository hotelRepository;

    @Transactional
    public RoomOfferResponse addRoomOffer(RoomOfferRequest request) {
        Hotel hotel = hotelRepository.findById(request.getHotelId())
            .orElseThrow(() -> new RuntimeException("Hotel not found"));

        RoomType roomType = null;
        if (request.getRoomTypeId() != null) {
            roomType = roomTypeRepository.findById(request.getRoomTypeId())
                .orElseThrow(() -> new RuntimeException("Room type not found"));
            
            if (!roomType.getHotel().getHotelID().equals(request.getHotelId())) {
                throw new RuntimeException("Room type does not belong to your hotel");
            }
        }

        RoomOffer offer = new RoomOffer();
        offer.setOfferName(request.getOfferName());
        offer.setDiscountValue(request.getDiscountValue());
        offer.setApplicableRoomType(roomType);
        offer.setApplicableHotel(hotel);
        offer.setStartDate(request.getStartDate());
        offer.setEndDate(request.getEndDate());
        offer.setMaxUsage(request.getMaxUsage());
        offer.setMinStayNights(request.getMinStayNights());
        offer.setMinBookingAmount(request.getMinBookingAmount());
        offer.setDescription(request.getDescription());
        offer.setIsActive(true);
        offer.setCurrentUsage(0);

        RoomOffer savedOffer = roomOfferRepository.save(offer);
        return RoomOfferMapper.mapToResponse(savedOffer);
    }

    public List<RoomOfferResponse> getRoomOffersByHotel(Integer hotelId) {
        List<RoomOffer> offers = roomOfferRepository.findByApplicableHotel_HotelID(hotelId);
        return offers.stream().map(RoomOfferMapper::mapToResponse).collect(Collectors.toList());
    }

    @Transactional
    public void deleteRoomOffer(Integer offerId, Integer hotelId) {
        RoomOffer offer = roomOfferRepository.findById(offerId).orElseThrow(() -> new RuntimeException("Offer not found"));

        if (!offer.getApplicableHotel().getHotelID().equals(hotelId)) {
            throw new RuntimeException("You are not authorized to delete this offer");
        }
        roomOfferRepository.delete(offer);
    }
}
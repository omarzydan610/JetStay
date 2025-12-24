package com.example.backend.mapper;

import com.example.backend.dto.HotelDTO.RoomOfferResponse;
import com.example.backend.entity.RoomOffer;

public class RoomOfferMapper {
    public static RoomOfferResponse mapToResponse(RoomOffer offer) {
        RoomOfferResponse response = new RoomOfferResponse();
        
        response.setRoomOfferId(offer.getRoomOfferId());
        response.setOfferName(offer.getOfferName());
        response.setDiscountValue(offer.getDiscountValue());
        
        if (offer.getApplicableRoomType() != null) {
            response.setRoomTypeName(offer.getApplicableRoomType().getRoomTypeName());
        }
        
        response.setHotelName(offer.getApplicableHotel().getHotelName());
        
        response.setStartDate(offer.getStartDate());
        response.setEndDate(offer.getEndDate());
        response.setMaxUsage(offer.getMaxUsage());
        response.setCurrentUsage(offer.getCurrentUsage());
        response.setMinStayNights(offer.getMinStayNights());
        response.setMinBookingAmount(offer.getMinBookingAmount());
        response.setIsActive(offer.getIsActive());
        response.setDescription(offer.getDescription());
        response.setCreatedAt(offer.getCreatedAt());
        
        return response;
    }
}
package com.example.backend.service.HotelService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.dto.HotelDTO.HotelStatisticsResponse;
import com.example.backend.dto.HotelDTO.HotelStatisticsResponse.RoomTypeStatisticsDTO;
import com.example.backend.entity.Hotel;
import com.example.backend.entity.RoomType;
import com.example.backend.exception.UnauthorizedException;
import com.example.backend.repository.HotelRepository;
import com.example.backend.repository.RoomTypeRepository;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class HotelStatisticsService {

  @Autowired
  private HotelRepository hotelRepository;

  @Autowired
  private RoomTypeRepository roomTypeRepository;

  public HotelStatisticsResponse getAllStatistics(int hotelID) {
    // Verify hotel exists
    Hotel hotel = hotelRepository.findById(hotelID)
        .orElseThrow(() -> new UnauthorizedException("Hotel not found for the given ID: " + hotelID));

    List<RoomType> roomTypes = roomTypeRepository.findByHotel(hotel);
    Integer totalRooms = roomTypes.stream()
        .mapToInt(RoomType::getQuantity)
        .sum();

    Integer occupiedRooms = 0; // Need to be impemented when booking is done

    // Build room type statistics
    List<RoomTypeStatisticsDTO> roomTypeStats = roomTypes.stream()
        .map(rt -> new RoomTypeStatisticsDTO(
            rt.getRoomTypeName(),
            rt.getQuantity(),
            0 // Need to be impemented when booking is done
        ))
        .collect(Collectors.toList());

    return new HotelStatisticsResponse(totalRooms, occupiedRooms, roomTypeStats);
  }
}

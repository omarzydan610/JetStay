package com.example.backend.service.HotelService;

import com.example.backend.dto.HotelDTO.HotelStatisticsResponse;
import com.example.backend.dto.HotelDTO.HotelStatisticsResponse.RoomTypeStatisticsDTO;
import com.example.backend.entity.Hotel;
import com.example.backend.entity.RoomType;
import com.example.backend.exception.UnauthorizedException;
import com.example.backend.repository.HotelRepository;
import com.example.backend.repository.RoomTypeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class HotelStatisticsServiceTest {

  @Mock
  private HotelRepository hotelRepository;

  @Mock
  private RoomTypeRepository roomTypeRepository;

  @InjectMocks
  private HotelDataService hotelDataService;

  private Hotel hotel;
  private RoomType singleRoom;
  private RoomType doubleRoom;
  private RoomType suiteRoom;
  private Integer hotelID;

  @BeforeEach
  void setUp() {
    hotelID = 1;

    // Create hotel
    hotel = new Hotel();
    hotel.setHotelID(hotelID);
    hotel.setHotelName("Test Hotel");
    hotel.setCity("Test City");
    hotel.setCountry("Test Country");

    // Create room types
    singleRoom = new RoomType();
    singleRoom.setRoomTypeID(1);
    singleRoom.setRoomTypeName("Single");
    singleRoom.setQuantity(20);
    singleRoom.setHotel(hotel);

    doubleRoom = new RoomType();
    doubleRoom.setRoomTypeID(2);
    doubleRoom.setRoomTypeName("Double");
    doubleRoom.setQuantity(30);
    doubleRoom.setHotel(hotel);

    suiteRoom = new RoomType();
    suiteRoom.setRoomTypeID(3);
    suiteRoom.setRoomTypeName("Suite");
    suiteRoom.setQuantity(10);
    suiteRoom.setHotel(hotel);
  }

  @Test
  void getAllStatistics_Success_WithRoomTypes() {
    // Arrange
    List<RoomType> roomTypes = Arrays.asList(singleRoom, doubleRoom, suiteRoom);
    when(hotelRepository.findById(hotelID)).thenReturn(Optional.of(hotel));
    when(roomTypeRepository.findByHotel(hotel)).thenReturn(roomTypes);

    // Act
    HotelStatisticsResponse result = hotelDataService.getStatistics(hotelID);

    // Assert
    assertNotNull(result);
    assertEquals(60, result.getTotalRooms()); // 20 + 30 + 10
    assertEquals(0, result.getOccupiedRooms()); // Currently hardcoded to 0
    assertEquals(3, result.getRoomTypes().size());

    // Verify room type details
    RoomTypeStatisticsDTO singleStats = result.getRoomTypes().get(0);
    assertEquals("Single", singleStats.getName());
    assertEquals(20, singleStats.getTotalRooms());
    assertEquals(0, singleStats.getOccupiedRooms());

    RoomTypeStatisticsDTO doubleStats = result.getRoomTypes().get(1);
    assertEquals("Double", doubleStats.getName());
    assertEquals(30, doubleStats.getTotalRooms());
    assertEquals(0, doubleStats.getOccupiedRooms());

    // Verify repository calls
    verify(hotelRepository, times(1)).findById(hotelID);
    verify(roomTypeRepository, times(1)).findByHotel(hotel);
  }

  @Test
  void getAllStatistics_Success_WithoutRoomTypes() {
    // Arrange
    when(hotelRepository.findById(hotelID)).thenReturn(Optional.of(hotel));
    when(roomTypeRepository.findByHotel(hotel)).thenReturn(Arrays.asList());

    // Act
    HotelStatisticsResponse result = hotelDataService.getStatistics(hotelID);

    // Assert
    assertNotNull(result);
    assertEquals(0, result.getTotalRooms());
    assertEquals(0, result.getOccupiedRooms());
    assertEquals(0, result.getRoomTypes().size());

    verify(hotelRepository, times(1)).findById(hotelID);
    verify(roomTypeRepository, times(1)).findByHotel(hotel);
  }

  @Test
  void getAllStatistics_HotelNotFound() {
    // Arrange
    when(hotelRepository.findById(hotelID)).thenReturn(Optional.empty());

    // Act & Assert
    assertThrows(UnauthorizedException.class, () -> {
      hotelDataService.getStatistics(hotelID);
    });

    verify(hotelRepository, times(1)).findById(hotelID);
    verify(roomTypeRepository, never()).findByHotel(any());
  }

  @Test
  void getAllStatistics_CalculatesTotalRoomsCorrectly() {
    // Arrange
    List<RoomType> roomTypes = Arrays.asList(singleRoom, doubleRoom, suiteRoom);
    when(hotelRepository.findById(hotelID)).thenReturn(Optional.of(hotel));
    when(roomTypeRepository.findByHotel(hotel)).thenReturn(roomTypes);

    // Act
    HotelStatisticsResponse result = hotelDataService.getStatistics(hotelID);

    // Assert
    Integer expectedTotal = singleRoom.getQuantity() + doubleRoom.getQuantity() + suiteRoom.getQuantity();
    assertEquals(expectedTotal, result.getTotalRooms());
    assertEquals(60, result.getTotalRooms());
  }

  @Test
  void getAllStatistics_RoomTypeStatisticsOrder() {
    // Arrange
    List<RoomType> roomTypes = Arrays.asList(singleRoom, doubleRoom, suiteRoom);
    when(hotelRepository.findById(hotelID)).thenReturn(Optional.of(hotel));
    when(roomTypeRepository.findByHotel(hotel)).thenReturn(roomTypes);

    // Act
    HotelStatisticsResponse result = hotelDataService.getStatistics(hotelID);

    // Assert
    List<RoomTypeStatisticsDTO> stats = result.getRoomTypes();
    assertEquals("Single", stats.get(0).getName());
    assertEquals("Double", stats.get(1).getName());
    assertEquals("Suite", stats.get(2).getName());
  }
}

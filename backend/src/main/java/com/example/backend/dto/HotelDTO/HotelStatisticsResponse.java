package com.example.backend.dto.HotelDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class HotelStatisticsResponse {
  private Integer totalRooms;
  private Integer occupiedRooms;
  private List<RoomTypeStatisticsDTO> roomTypes;

  @Data
  @AllArgsConstructor
  @NoArgsConstructor
  public static class RoomTypeStatisticsDTO {
    private String name;
    private Integer totalRooms;
    private Integer occupiedRooms;
  }
}

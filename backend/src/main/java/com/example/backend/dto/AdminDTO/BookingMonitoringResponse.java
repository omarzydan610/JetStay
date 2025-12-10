package com.example.backend.dto.AdminDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BookingMonitoringResponse {
  private Integer totalBookings;
  private Double totalRevenue;
  private Double totalRoomsBooked;
  private Double totalGuests;
  private Map<String, Integer> bookingsByStatus;
  private Map<String, Integer> bookingsByPaymentStatus;
  private List<HotelBookingStats> bookingsByHotel;
  private List<PaymentMethodStats> bookingsByPaymentMethod;
  private List<DailyBookingStats> dailyBookings;

  @Data
  @AllArgsConstructor
  @NoArgsConstructor
  @Builder
  public static class HotelBookingStats {
    private Integer hotelId;
    private String hotelName;
    private Integer totalBookings;
    private Double totalRevenue;
  }

  @Data
  @AllArgsConstructor
  @NoArgsConstructor
  @Builder
  public static class PaymentMethodStats {
    private Integer methodId;
    private String methodName;
    private Integer count;
    private Double totalAmount;
  }

  @Data
  @AllArgsConstructor
  @NoArgsConstructor
  @Builder
  public static class DailyBookingStats {
    private String date;
    private Integer totalBookings;
    private Double totalRevenue;
  }
}

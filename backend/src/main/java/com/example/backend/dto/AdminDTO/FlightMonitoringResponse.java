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
public class FlightMonitoringResponse {
  private Integer totalTickets;
  private Double totalRevenue;
  private Map<String, Integer> ticketsByPaymentStatus;
  private List<AirlineTicketStats> ticketsByAirline;
  private Map<String, Integer> flightsByStatus;
  private Map<String, Integer> paymentsByStatus;
  private List<PaymentMethodStats> paymentsByMethod;
  private List<DailyTicketStats> dailyTickets;

  @Data
  @AllArgsConstructor
  @NoArgsConstructor
  @Builder
  public static class AirlineTicketStats {
    private Integer airlineId;
    private String airlineName;
    private Integer totalTickets;
    private Double totalRevenue;
  }

  @Data
  @AllArgsConstructor
  @NoArgsConstructor
  @Builder
  public static class PaymentMethodStats {
    private String methodName;
    private Integer count;
    private Double totalAmount;
  }

  @Data
  @AllArgsConstructor
  @NoArgsConstructor
  @Builder
  public static class DailyTicketStats {
    private String date;
    private Integer count;
    private Double revenue;
  }
}

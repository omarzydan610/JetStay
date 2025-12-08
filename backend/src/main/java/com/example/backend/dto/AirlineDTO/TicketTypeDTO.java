package com.example.backend.dto.AirlineDTO;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TicketTypeDTO {
  private String typeName;
  private Float price;
  private Integer quantity;
}

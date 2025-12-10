package com.example.backend.dto.AdminDTO.DatabaseDTO;

import com.example.backend.entity.BookingTransaction;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class CountByStateDTO {
    BookingTransaction.Status status;
    Long count;
}

package com.example.backend.dto.AirlineDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AirlineUpdateDataRequest {
    private String name;
    private String nationality;
    private String logoUrl;
}
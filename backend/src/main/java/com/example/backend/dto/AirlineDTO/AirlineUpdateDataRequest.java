package com.example.backend.dto.AirlineDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AirlineUpdateDataRequest {
    private String name;
    private String nationality;
    private MultipartFile logoFile;
}
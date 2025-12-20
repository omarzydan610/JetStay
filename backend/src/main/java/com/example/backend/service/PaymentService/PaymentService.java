package com.example.backend.service.PaymentService;

import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class PaymentService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final String FASTAPI_URL = "http://localhost:8000/api/payments";

    public String callFastApi() {
        ResponseEntity<String> response = restTemplate.getForEntity(
                FASTAPI_URL,
                String.class
        );
        return response.getBody();
    }
}
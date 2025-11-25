package com.example.backend;

import com.example.backend.service.AuthService.JwtAuthService;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

@SpringBootTest
class BackendApplicationTests {

    @MockBean
    private JwtAuthService jwtAuthService;

	@Test
	void contextLoads() {
	}

}

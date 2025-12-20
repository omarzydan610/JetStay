package com.example.backend.controller.PaymentController;

import com.example.backend.service.PaymentService.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @GetMapping("/call")
    public String callFastApi() {
        return paymentService.callFastApi();
    }
}

package com.vaultycash.app.controller;

import com.vaultycash.app.dto.*;
import com.vaultycash.app.service.CustomerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final CustomerService customerService;

    public AuthController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse> register(@RequestBody RegisterRequest request) {
        try {
            LoginResponse customer = customerService.register(request);
            return ResponseEntity.status(201)
                    .body(new ApiResponse(true, "Account created! Your Account No: " + customer.getAccountNumber(), customer));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(@RequestBody LoginRequest request) {
        try {
            LoginResponse customer = customerService.login(request);
            return ResponseEntity.ok(new ApiResponse(true, "Login successful. Welcome " + customer.getName() + "!", customer));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }
}

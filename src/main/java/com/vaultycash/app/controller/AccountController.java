package com.vaultycash.app.controller;

import com.vaultycash.app.dto.*;
import com.vaultycash.app.service.CustomerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/account")
public class AccountController {

    private final CustomerService customerService;

    public AccountController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getProfile(@PathVariable Long id) {
        try {
            LoginResponse profile = customerService.getProfile(id);
            return ResponseEntity.ok(new ApiResponse(true, "Profile fetched.", profile));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> updateProfile(@PathVariable Long id, @RequestBody EditProfileRequest request) {
        try {
            LoginResponse updated = customerService.updateProfile(id, request);
            return ResponseEntity.ok(new ApiResponse(true, "Information updated.", updated));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }

    @PutMapping("/{id}/password")
    public ResponseEntity<ApiResponse> changePassword(@PathVariable Long id, @RequestBody ChangePasswordRequest request) {
        try {
            request.setCustomerId(id);
            customerService.changePassword(request);
            return ResponseEntity.ok(new ApiResponse(true, "Password changed successfully."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }

    @PutMapping("/{id}/pin")
    public ResponseEntity<ApiResponse> changePin(@PathVariable Long id, @RequestBody ChangePinRequest request) {
        try {
            request.setCustomerId(id);
            customerService.changePin(request);
            return ResponseEntity.ok(new ApiResponse(true, "PIN changed successfully."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }
}

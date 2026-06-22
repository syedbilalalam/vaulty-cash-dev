package com.vaultycash.app.controller;

import com.vaultycash.app.dto.*;
import com.vaultycash.app.service.CustomerService;
import com.vaultycash.app.repository.CustomerRepository;
import com.vaultycash.app.model.Customer;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/account")
public class AccountController {

    private final CustomerService customerService;
    private final CustomerRepository customerRepository;

    public AccountController(CustomerService customerService, CustomerRepository customerRepository) {
        this.customerService = customerService;
        this.customerRepository = customerRepository;
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

    @PostMapping("/{id}/card")
    public ResponseEntity<ApiResponse> getCardDetails(@PathVariable Long id, @RequestBody CardDetailsRequest request) {
        try {
            Customer customer = customerRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Customer not found."));

            boolean pinMatches = false;
            if (customer.getPin().length() == 4 && customer.getPin().matches("\\d{4}")) {
                if (customer.getPin().equals(request.getPin())) pinMatches = true;
            } else {
                try {
                    pinMatches = org.mindrot.jbcrypt.BCrypt.checkpw(request.getPin(), customer.getPin());
                } catch (Exception e) {}
            }

            if (!pinMatches) {
                throw new IllegalArgumentException("Incorrect PIN.");
            }

            java.util.Map<String, String> cardDetails = new java.util.HashMap<>();
            cardDetails.put("cardNumber", customer.getCardNumber());
            cardDetails.put("cvv", customer.getCvv());
            cardDetails.put("cardExpiry", customer.getCardExpiry());

            return ResponseEntity.ok(new ApiResponse(true, "Card details verified.", cardDetails));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }
}

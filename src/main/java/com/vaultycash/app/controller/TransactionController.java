package com.vaultycash.app.controller;

import com.vaultycash.app.dto.*;
import com.vaultycash.app.service.TransactionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/transaction")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping("/deposit")
    public ResponseEntity<ApiResponse> deposit(@RequestBody DepositRequest request) {
        try {
            Map<String, Object> result = transactionService.deposit(request);
            return ResponseEntity.ok(new ApiResponse(true,
                    "PKR " + request.getAmount() + " deposited. New balance: PKR " + result.get("newBalance"), result));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }

    @PostMapping("/withdraw")
    public ResponseEntity<ApiResponse> withdraw(@RequestBody WithdrawRequest request) {
        try {
            Map<String, Object> result = transactionService.withdraw(request);
            return ResponseEntity.ok(new ApiResponse(true,
                    "PKR " + request.getAmount() + " withdrawn. Remaining: PKR " + result.get("newBalance"), result));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }

    @PostMapping("/transfer")
    public ResponseEntity<ApiResponse> transfer(@RequestBody TransferRequest request) {
        try {
            Map<String, Object> result = transactionService.transfer(request);
            return ResponseEntity.ok(new ApiResponse(true,
                    "PKR " + request.getAmount() + " sent to " + result.get("receiverName") + ".", result));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }

    @GetMapping("/statement/{customerId}")
    public ResponseEntity<ApiResponse> getStatement(@PathVariable Long customerId) {
        try {
            List<Map<String, Object>> statement = transactionService.getStatement(customerId);
            return ResponseEntity.ok(new ApiResponse(true, "Statement fetched.", statement));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }
}

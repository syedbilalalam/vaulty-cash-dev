package com.vaultycash.app.dto;

public class DepositRequest {
    private Long customerId;
    private double amount;

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public double getAmount() { return amount; }
    public void setAmount(double amount) { this.amount = amount; }
}

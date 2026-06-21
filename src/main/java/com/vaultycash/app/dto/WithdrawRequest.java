package com.vaultycash.app.dto;

public class WithdrawRequest {
    private Long customerId;
    private double amount;
    private int pin;

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public double getAmount() { return amount; }
    public void setAmount(double amount) { this.amount = amount; }

    public int getPin() { return pin; }
    public void setPin(int pin) { this.pin = pin; }
}

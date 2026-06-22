package com.vaultycash.app.dto;

public class DepositRequest {
    private Long customerId;
    private double amount;
    private String pin;
    private String depositMethod;

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public double getAmount() { return amount; }
    public void setAmount(double amount) { this.amount = amount; }

    public String getPin() { return pin; }
    public void setPin(String pin) { this.pin = pin; }

    public String getDepositMethod() { return depositMethod; }
    public void setDepositMethod(String depositMethod) { this.depositMethod = depositMethod; }
}

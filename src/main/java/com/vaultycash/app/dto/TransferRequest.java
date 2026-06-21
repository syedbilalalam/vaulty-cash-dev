package com.vaultycash.app.dto;

public class TransferRequest {
    private Long senderId;
    private String receiverAccountNumber;
    private double amount;
    private int pin;

    public Long getSenderId() { return senderId; }
    public void setSenderId(Long senderId) { this.senderId = senderId; }

    public String getReceiverAccountNumber() { return receiverAccountNumber; }
    public void setReceiverAccountNumber(String receiverAccountNumber) { this.receiverAccountNumber = receiverAccountNumber; }

    public double getAmount() { return amount; }
    public void setAmount(double amount) { this.amount = amount; }

    public int getPin() { return pin; }
    public void setPin(int pin) { this.pin = pin; }
}

package com.vaultycash.app.dto;

public class TransferRequest {
    private Long senderId;
    private String receiverIdentifier;
    private double amount;
    private String pin;

    public Long getSenderId() { return senderId; }
    public void setSenderId(Long senderId) { this.senderId = senderId; }

    public String getReceiverIdentifier() { return receiverIdentifier; }
    public void setReceiverIdentifier(String receiverIdentifier) { this.receiverIdentifier = receiverIdentifier; }

    public double getAmount() { return amount; }
    public void setAmount(double amount) { this.amount = amount; }

    public String getPin() { return pin; }
    public void setPin(String pin) { this.pin = pin; }
}

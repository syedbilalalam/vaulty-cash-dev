package com.vaultycash.app.dto;

public class ChangePinRequest {
    private Long customerId;
    private int oldPin;
    private int newPin;
    private int confirmPin;

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public int getOldPin() { return oldPin; }
    public void setOldPin(int oldPin) { this.oldPin = oldPin; }

    public int getNewPin() { return newPin; }
    public void setNewPin(int newPin) { this.newPin = newPin; }

    public int getConfirmPin() { return confirmPin; }
    public void setConfirmPin(int confirmPin) { this.confirmPin = confirmPin; }
}

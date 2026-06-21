package com.vaultycash.app.dto;

public class ChangePinRequest {
    private Long customerId;
    private String oldPin;
    private String newPin;
    private String confirmPin;

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public String getOldPin() { return oldPin; }
    public void setOldPin(String oldPin) { this.oldPin = oldPin; }

    public String getNewPin() { return newPin; }
    public void setNewPin(String newPin) { this.newPin = newPin; }

    public String getConfirmPin() { return confirmPin; }
    public void setConfirmPin(String confirmPin) { this.confirmPin = confirmPin; }
}

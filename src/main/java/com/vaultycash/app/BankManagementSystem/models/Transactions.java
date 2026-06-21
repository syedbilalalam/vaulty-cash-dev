/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.vaultycash.app.BankManagementSystem.models;

/**
 *
 * @author Muhammad
 */
public class Transactions {
    private String senderName;
    private String receiverName;
    private double amount;
    private String type;

    public Transactions(String senderName,String receiverName,double amount,String type) {

        this.senderName = senderName;
        this.receiverName = receiverName;
        this.amount = amount;
        this.type = type;
    }

    public String getSenderName() {
        return senderName;
    }

    public String getReceiverName() {
        return receiverName;
    }

    public double getAmount() {
        return amount;
    }

    public String getType() {
        return type;
    }
    
}

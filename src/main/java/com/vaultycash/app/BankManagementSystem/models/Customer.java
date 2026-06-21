/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.vaultycash.app.BankManagementSystem.models;

/**
 *
 * @author Muhammad
 */
public class Customer {
    private String name;
    private int age;
    private String gender;
    private String email;
    private String phoneNumber;
    private String password;
    private int pin;
    private double balance;
    private String accountNumber;
    private String iban;

    
    // Default Constructor
    public Customer() {
        
    }

    
    // Parameterized Constructor
    public Customer(String name, int age, String gender, String email,
                    String phoneNumber, String password, int pin,
                    double balance, String accountNumber, String iban) {
        
        this.name = name;
        this.age = age;
        this.gender = gender;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.password = password;
        this.pin = pin;
        this.balance = balance;
        this.accountNumber = accountNumber;
        this.iban = iban;
    }

    
    // Getters and Setters

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    
    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    
    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    
    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    
    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    
    public int getPin() {
        return pin;
    }

    public void setPin(int pin) {
        this.pin = pin;
    }

    
    public double getBalance() {
        return balance;
    }

    public void setBalance(double balance) {
        this.balance = balance;
    }

    
    public String getAccountNumber() {
        return accountNumber;
    }

    public void setAccountNumber(String accountNumber) {
        this.accountNumber = accountNumber;
    }

    
    public String getIban() {
        return iban;
    }

    public void setIban(String iban) {
        this.iban = iban;
    }

    
    // Display Method
    public void displayInfo() {
        
        System.out.println("----- Customer Information -----");
        System.out.println("Name: " + name);
        System.out.println("Age: " + age);
        System.out.println("Gender: " + gender);
        System.out.println("Email: " + email);
        System.out.println("Phone Number: " + phoneNumber);
        System.out.println("Balance: " + balance);
        System.out.println("Account Number: " + accountNumber);
        System.out.println("IBAN: " + iban);
    }
}
    


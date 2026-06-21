package com.vaultycash.app.dto;

public class LoginResponse {
    private Long id;
    private String name;
    private int age;
    private String gender;
    private String email;
    private String phone;
    private String pin;
    private double balance;
    private String accountNumber;
    private String iban;

    public LoginResponse() {}

    public LoginResponse(Long id, String name, int age, String gender, String email,
                         String phone, String pin, double balance, String accountNumber, String iban) {
        this.id = id;
        this.name = name;
        this.age = age;
        this.gender = gender;
        this.email = email;
        this.phone = phone;
        this.pin = pin;
        this.balance = balance;
        this.accountNumber = accountNumber;
        this.iban = iban;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public int getAge() { return age; }
    public void setAge(int age) { this.age = age; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getPin() { return pin; }
    public void setPin(String pin) { this.pin = pin; }

    public double getBalance() { return balance; }
    public void setBalance(double balance) { this.balance = balance; }

    public String getAccountNumber() { return accountNumber; }
    public void setAccountNumber(String accountNumber) { this.accountNumber = accountNumber; }

    public String getIban() { return iban; }
    public void setIban(String iban) { this.iban = iban; }
}

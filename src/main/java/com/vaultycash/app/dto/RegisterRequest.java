package com.vaultycash.app.dto;

public class RegisterRequest {
    private String name;
    private int age;
    private String gender;
    private String email;
    private String phone;
    private String password;
    private String pin;
    private double balance;

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

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getPin() { return pin; }
    public void setPin(String pin) { this.pin = pin; }

    public double getBalance() { return balance; }
    public void setBalance(double balance) { this.balance = balance; }
}

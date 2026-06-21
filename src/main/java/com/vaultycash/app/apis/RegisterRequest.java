package com.vaultycash.app.apis;

public class RegisterRequest {
    private String name;
    private int age;
    private String gender;
    private String email;
    private String number;
    private String password;
    private int pin;
    private int initialBalance;

    public String getName() {
        return name;
    }

    public int getAge() {
        return age;
    }

    public String getGender() {
        return gender;
    }

    public String getEmail() {
        return email;
    }

    public String getNumber() {
        return number;
    }

    public String getPassword() {
        return password;
    }

    public int getPin() {
        return pin;
    }

    public int getInitialBalance() {
        return initialBalance;
    }
}

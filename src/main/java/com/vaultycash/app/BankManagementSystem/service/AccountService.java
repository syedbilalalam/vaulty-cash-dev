/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.vaultycash.app.BankManagementSystem.service;

/**
 *
 * @author Muhammad
 */
import java.util.ArrayList;
import java.util.Scanner;
import com.vaultycash.app.BankManagementSystem.models.Customer;
import com.vaultycash.app.BankManagementSystem.models.Transactions;
public class AccountService {
    Scanner input = new Scanner(System.in);

    // ArrayList to store customers
    static ArrayList<Customer> Customers = new ArrayList<>();
    static ArrayList<Transactions> transactions= new ArrayList<>();
    private Customer currentCustomer;


    // Register Method
    public void registerCustomer() {

        System.out.println("\n===== REGISTRATION PAGE =====");

        System.out.print("Enter Name: ");
        String name = input.nextLine();

        System.out.print("Enter Age: ");
        int age = input.nextInt();
        input.nextLine();

        System.out.print("Enter Gender: ");
        String gender = input.nextLine();

        System.out.print("Enter Email: ");
        String email = input.nextLine();

        System.out.print("Enter Phone Number: ");
        String phone = input.nextLine();

        System.out.print("Enter Password: ");
        String password = input.nextLine();

        System.out.print("Create 4 Digit PIN: ");
        int pin = input.nextInt();

        System.out.print("Enter Initial Balance: ");
        double balance = input.nextDouble();

        input.nextLine();


        // Auto generated account info
        String accountNumber = "ACC" + (Customers.size() + 1);
        String iban = "PK00BANK" + (Customers.size() + 1);


        // Create Customer Object
        Customer c1 = new Customer(
                name,
                age,
                gender,
                email,
                phone,
                password,
                pin,
                balance,
                accountNumber,
                iban
        );


        // Add object in ArrayList
        Customers.add(c1);


        System.out.println("\nRegistration Successful");
        System.out.println("Your Account Number is: " + accountNumber);
        System.out.println("Your IBAN is: " + iban);
    }
        // Login Method
    public void loginCustomer() {

        System.out.println("\n===== LOGIN PAGE =====");

        System.out.print("Enter Phone Number: ");
        String phone = input.nextLine();

        System.out.print("Enter Password: ");
        String password = input.nextLine();

        boolean found = false;

        
        // Loop to check customer
        for (Customer c : Customers) {

            if (c.getPhoneNumber().equals(phone)
                    && c.getPassword().equals(password)) {
                currentCustomer=c;

                System.out.println("\nLogin Successful");
                System.out.println("Welcome " + c.getName());

                found = true;
                break;
            }
        }

        
        // If account not found
        if (!found) {
            System.out.println("\nInvalid Phone number or Password!");
        }
    }
//    show account info method
    public void showAccountInfo() {

    if (currentCustomer == null) {

        System.out.println("\nPlease login first.");
        return;
    }

    System.out.println("\n===== ACCOUNT INFORMATION =====");

    System.out.println("Name: " + currentCustomer.getName());
    System.out.println("Age: " + currentCustomer.getAge());
    System.out.println("Gender: " + currentCustomer.getGender());
    System.out.println("Email: " + currentCustomer.getEmail());
    System.out.println("Phone Number: " + currentCustomer.getPhoneNumber());

    System.out.println("Balance: " + currentCustomer.getBalance());

    System.out.println("Account Number: "+ currentCustomer.getAccountNumber());

    System.out.println("IBAN: "+ currentCustomer.getIban());
}
//    Edit info method
    public void editInfo() {

    if (currentCustomer == null) {

        System.out.println("\nPlease login first.");
        return;
    }

    System.out.println("\n===== EDIT INFORMATION =====");

    System.out.print("Enter New Name: ");
    String newName = input.nextLine();

    System.out.print("Enter New Email: ");
    String newEmail = input.nextLine();

    System.out.print("Enter New Phone Number: ");
    String newPhone = input.nextLine();

    currentCustomer.setName(newName);
    currentCustomer.setEmail(newEmail);
    currentCustomer.setPhoneNumber(newPhone);

    System.out.println("\nInformation Updated Successfully.");
}
// Money Transferring method
    public void transferMoney() {

    if (currentCustomer == null) {

        System.out.println("\nPlease login first.");
        return;
    }

    System.out.println("\n===== BANK TRANSFER =====");

    System.out.print("Enter Receiver Account Number: ");
    String receiverAccount = input.nextLine();

    System.out.print("Enter Amount: ");
    double amount = input.nextDouble();
    input.nextLine();

    Customer receiver = null;  //Abhi koi receiver nhi h islye null

    for (Customer c : Customers) {  //------>Arraylist k har customer ko check krega

        if (c.getAccountNumber().equals(receiverAccount)) {   //------>if Acc2 .equals Acc2

            receiver = c;  //------>receiver k andar woh customer save hogaya
            break;
        }
    }
    if(receiver==currentCustomer){
        System.out.println("You cannot transfer to your own account!!");
        return;
    }

    if (receiver == null) {

        System.out.println("Account Not Found");
        return;
    }

    TransferService transferService = new TransferService();
//currentCustomer loggedin user h
    transferService.bankTransfer(currentCustomer,receiver,amount); //-------> Ali,ahmed,1000
    Transactions t = new Transactions(
        currentCustomer.getName(),
        receiver.getName(),
        amount,
        "Bank Transfer"
);

transactions.add(t);
}
//    Showing statements of user method
    public void showStatement() {

    System.out.println("\n===== ACCOUNT STATEMENT =====");
    boolean found=false;

    for(Transactions t : transactions){
         if(t.getSenderName().equals(currentCustomer.getName())
           || t.getReceiverName().equals(currentCustomer.getName())){
        
        
        

        System.out.println("--------------------");

        System.out.println("Sender: "+ t.getSenderName());

        System.out.println("Receiver: "+ t.getReceiverName());

        System.out.println("Amount: "+ t.getAmount());

        System.out.println("Type: "+ t.getType());
        found=true;
         }
         if(!found){
             System.out.println(" No transactions found!");
         }
    
    }
}
//    Depositing Money method
    public void depositMoney() {

    if(currentCustomer == null){
        System.out.println("Please login first.");
        return;
    }

    System.out.print("Enter Amount to Deposit: ");
    double amount = input.nextDouble();
    input.nextLine();

    if(amount <= 0){
        System.out.println("Invalid Amount");
        return;
    }

    currentCustomer.setBalance(
        currentCustomer.getBalance() + amount
    );

    Transactions t = new Transactions("Cash Deposit",currentCustomer.getName(),amount,"Deposit");

    transactions.add(t);

    System.out.println("Amount Deposited Successfully");
    System.out.println("New Balance: " +currentCustomer.getBalance());
}
    
//    Withdraw method
    public void withdrawMoney() {

    if(currentCustomer == null){
        System.out.println("Please login first.");
        return;
    }

    System.out.print("Enter Amount to Withdraw: ");
    double amount = input.nextDouble();
    input.nextLine();

    if(amount <= 0){
        System.out.println("Invalid Amount");
        return;
    }

    if(currentCustomer.getBalance() < amount){
        System.out.println("Insufficient Balance");
        return;
    }

    System.out.print("Enter PIN: ");
    int enteredPin = input.nextInt();
    input.nextLine();

    if(currentCustomer.getPin() != enteredPin){
        System.out.println("Incorrect PIN");
        return;
    }

    currentCustomer.setBalance(
        currentCustomer.getBalance() - amount
    );

    Transactions t = new Transactions(currentCustomer.getName(),"Cash Withdrawal",amount,"Withdraw");

    transactions.add(t);

    System.out.println("Amount Withdrawn Successfully");
    System.out.println("Remaining Balance: "+ currentCustomer.getBalance());
}
    
//    LogOut method
    public void logout(){
        if(currentCustomer==null){
            System.out.println("No user is Logged In");
            return;
        }
        System.out.println(currentCustomer.getName()+" Logged Out successfully:");
        currentCustomer=null;
    }

// Change Password method
public void changePassword() {

    if(currentCustomer == null){
        System.out.println("Please Login First.");
        return;
    }

    System.out.print("Enter Current Password: ");
    String oldPassword = input.nextLine();

    if(!currentCustomer.getPassword().equals(oldPassword)){
        System.out.println("Incorrect Current Password.");
        return;
    }

    System.out.print("Enter New Password: ");
    String newPassword = input.nextLine();

    System.out.print("Confirm New Password: ");
    String confirmPassword = input.nextLine();

    if(!newPassword.equals(confirmPassword)){
        System.out.println("Passwords Do Not Match.");
        return;
    }

    currentCustomer.setPassword(newPassword);

    System.out.println("Password Changed Successfully.");
}    

//Change PIN method
public void changePin() {

    if(currentCustomer == null){
        System.out.println("Please Login First.");
        return;
    }

    System.out.print("Enter Current PIN: ");
    int oldPin = input.nextInt();

    if(currentCustomer.getPin() != oldPin){
        System.out.println("Incorrect Current PIN.");
        input.nextLine();
        return;
    }

    System.out.print("Enter New PIN: ");
    int newPin = input.nextInt();

    System.out.print("Confirm New PIN: ");
    int confirmPin = input.nextInt();
    input.nextLine();

    if(newPin != confirmPin){
        System.out.println("PINs Do Not Match.");
        return;
    }

    currentCustomer.setPin(newPin);

    System.out.println("PIN Changed Successfully.");
}
}

/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.vaultycash.app.BankManagementSystem.service;

/**
 *
 * @author Muhammad
 */
import com.vaultycash.app.BankManagementSystem.models.Customer;
import java.util.Scanner;
public class TransferService {
    public void bankTransfer(Customer sender, Customer receiver, double amount) {
        Scanner sc=new Scanner(System.in);
        System.out.print("Enter PIN: ");
        int enteredpin=sc.nextInt();
        if(sender.getPin()!=enteredpin){
            System.out.println("Incorrect PIN");
            return;
        }
        

        if (amount <= 0) {

            System.out.println("Invalid Amount");
            return;
        }

        if (sender.getBalance() < amount) {  //--------> agar sender ka balance amount se chota

            System.out.println("Insufficient Balance");
            return;
        }

        sender.setBalance(
                sender.getBalance() - amount  //----> sender k balance mn se amount cut
        );

        receiver.setBalance(
                receiver.getBalance() + amount  //------> amount add receiver k balance mn
        );

        System.out.println("\nTransfer Successful");

        System.out.println("From: "+ sender.getName());

        System.out.println("To: "+ receiver.getName());

        System.out.println("Amount: "+ amount);
    }
    
}

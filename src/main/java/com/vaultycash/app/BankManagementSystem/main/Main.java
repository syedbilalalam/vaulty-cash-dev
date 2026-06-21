/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.vaultycash.app.BankManagementSystem.main;

/**
 * @author Muhammad
 */
import java.util.Scanner;
import com.vaultycash.app.BankManagementSystem.service.AccountService;
public class Main {
    public static void main(String[] args) {

        Scanner input = new Scanner(System.in);
        AccountService accountService = new AccountService();

        int choice;

        do {

            System.out.println("\n===== BANK MANAGEMENT SYSTEM =====");
            System.out.println("1. Register");
            System.out.println("2. Login");
            System.out.println("3. Account info");
            System.out.println("4. Edit info");
            System.out.println("5. Bank Transfer");
            System.out.println("6. Account Statement");
            System.out.println("7. Deposit");
            System.out.println("8. Withdraw");
            System.out.println("9. Change Password");
            System.out.println("10.Change PIN");
            System.out.println("11.Logout");
            System.out.println("12.Exit");

            System.out.print("Enter your choice: ");
            choice = input.nextInt();

            switch (choice) {

                case 1:
                    accountService.registerCustomer();
                    break;

                case 2:
                    accountService.loginCustomer();
                    break;

                case 3:
                    accountService.showAccountInfo();
                    break;
                    
                case 4:
                    accountService.editInfo();
                    break;
                 
                case 5:
                    accountService.transferMoney();
                    break;
                    
                case 6:
                    accountService.showStatement();
                    break;
                    
                case 7:
                    accountService.depositMoney();
                    break;
                    
                case 8:
                    accountService.withdrawMoney();
                    break;
                    
                    
                case 9:
                    accountService.changePassword();
                    break;
                    
                case 10:
                    accountService.changePin();
                    break;
                    
                case 11:
                    accountService.logout();
                    break;
                case 12:
                    System.out.println("Thank You For Using Our Bank System");
                    break;


                default:
                    System.out.println("Invalid Choice");
            }

        } while (choice != 12);

    }
    
    
}

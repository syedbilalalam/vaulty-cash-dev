package com.vaultycash.app.apis;

import com.vaultycash.app.BankManagementSystem.main.Global;
import com.vaultycash.app.BankManagementSystem.models.Customer;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;

import static com.vaultycash.app.BankManagementSystem.main.Global.customersArr;

@RestController
@RequestMapping("/api/register")
public class Register {

    @PostMapping
    public ResponseEntity<String> createProduct(@RequestBody RegisterRequest register) {
        String accountNumber = "ACC" + (customersArr.size() + 1);
        String iban = "PK00BANK" + (customersArr.size() + 1);

        Customer customer = new Customer(
                register.getName(),
                register.getAge(),
                register.getGender(),
                register.getEmail(),
                register.getNumber(),
                register.getPassword(),
                register.getPin(),
                register.getInitialBalance(),
                accountNumber,
                iban
        );

        customersArr.add(customer);
        System.out.println("Received: " + register.getName() + " - " + register.getInitialBalance());

        return ResponseEntity.status(201).body("success");
    }
}
package com.vaultycash.app.service;

import com.vaultycash.app.dto.*;
import com.vaultycash.app.model.Customer;
import com.vaultycash.app.model.Transaction;
import com.vaultycash.app.repository.CustomerRepository;
import com.vaultycash.app.repository.TransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class TransactionService {

    private final CustomerRepository customerRepository;
    private final TransactionRepository transactionRepository;

    public TransactionService(CustomerRepository customerRepository, TransactionRepository transactionRepository) {
        this.customerRepository = customerRepository;
        this.transactionRepository = transactionRepository;
    }

    @Transactional
    public Map<String, Object> deposit(DepositRequest request) {
        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new IllegalArgumentException("Customer not found."));

        if (request.getAmount() <= 0) {
            throw new IllegalArgumentException("Enter a valid amount.");
        }

        double newBalance = customer.getBalance() + request.getAmount();
        customer.setBalance(newBalance);
        customerRepository.save(customer);

        Transaction transaction = new Transaction(
                "Cash Deposit",
                customer.getName(),
                request.getAmount(),
                "Deposit",
                customer
        );
        transactionRepository.save(transaction);

        Map<String, Object> result = new HashMap<>();
        result.put("newBalance", newBalance);
        result.put("amount", request.getAmount());
        return result;
    }

    @Transactional
    public Map<String, Object> withdraw(WithdrawRequest request) {
        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new IllegalArgumentException("Customer not found."));

        if (request.getAmount() <= 0) {
            throw new IllegalArgumentException("Enter a valid amount.");
        }
        if (customer.getBalance() < request.getAmount()) {
            throw new IllegalArgumentException("Insufficient balance.");
        }
        if (!customer.getPin().equals(request.getPin())) {
            throw new IllegalArgumentException("Incorrect PIN.");
        }

        double newBalance = customer.getBalance() - request.getAmount();
        customer.setBalance(newBalance);
        customerRepository.save(customer);

        Transaction transaction = new Transaction(
                customer.getName(),
                "Cash Withdrawal",
                request.getAmount(),
                "Withdraw",
                customer
        );
        transactionRepository.save(transaction);

        Map<String, Object> result = new HashMap<>();
        result.put("newBalance", newBalance);
        result.put("amount", request.getAmount());
        return result;
    }

    @Transactional
    public Map<String, Object> transfer(TransferRequest request) {
        Customer sender = customerRepository.findById(request.getSenderId())
                .orElseThrow(() -> new IllegalArgumentException("Sender not found."));

        if (request.getAmount() <= 0) {
            throw new IllegalArgumentException("Enter a valid amount.");
        }
        if (!sender.getPin().equals(request.getPin())) {
            throw new IllegalArgumentException("Incorrect PIN.");
        }

        Customer receiver = customerRepository.findByAccountNumber(request.getReceiverAccountNumber())
                .orElseThrow(() -> new IllegalArgumentException("Receiver account not found."));

        if (sender.getAccountNumber().equals(receiver.getAccountNumber())) {
            throw new IllegalArgumentException("You cannot transfer to your own account.");
        }
        if (sender.getBalance() < request.getAmount()) {
            throw new IllegalArgumentException("Insufficient balance.");
        }

        // Update balances
        sender.setBalance(sender.getBalance() - request.getAmount());
        receiver.setBalance(receiver.getBalance() + request.getAmount());
        customerRepository.save(sender);
        customerRepository.save(receiver);

        // Record transaction for sender
        Transaction senderTx = new Transaction(
                sender.getName(),
                receiver.getName(),
                request.getAmount(),
                "Bank Transfer",
                sender
        );
        transactionRepository.save(senderTx);

        // Record transaction for receiver
        Transaction receiverTx = new Transaction(
                sender.getName(),
                receiver.getName(),
                request.getAmount(),
                "Bank Transfer",
                receiver
        );
        transactionRepository.save(receiverTx);

        Map<String, Object> result = new HashMap<>();
        result.put("newBalance", sender.getBalance());
        result.put("amount", request.getAmount());
        result.put("receiverName", receiver.getName());
        return result;
    }

    public List<Map<String, Object>> getStatement(Long customerId) {
        customerRepository.findById(customerId)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found."));

        List<Transaction> transactions = transactionRepository.findByCustomerIdOrderByTimestampDesc(customerId);

        List<Map<String, Object>> result = new ArrayList<>();
        for (Transaction t : transactions) {
            Map<String, Object> entry = new HashMap<>();
            entry.put("id", t.getId());
            entry.put("senderName", t.getSenderName());
            entry.put("receiverName", t.getReceiverName());
            entry.put("amount", t.getAmount());
            entry.put("type", t.getType());
            entry.put("timestamp", t.getTimestamp().toString());
            result.add(entry);
        }
        return result;
    }
}

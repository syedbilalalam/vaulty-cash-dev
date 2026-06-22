package com.vaultycash.app.service;

import com.vaultycash.app.dto.*;
import com.vaultycash.app.model.Customer;
import com.vaultycash.app.model.Transaction;
import com.vaultycash.app.repository.CustomerRepository;
import com.vaultycash.app.repository.TransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.mindrot.jbcrypt.BCrypt;

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
        
        // Deposit PIN verification with fallback
        if (request.getPin() == null) {
            throw new IllegalArgumentException("PIN is required for deposit.");
        }
        boolean pinMatches = false;
        if (customer.getPin().length() == 4 && customer.getPin().matches("\\d{4}")) {
            if (customer.getPin().equals(request.getPin())) pinMatches = true;
        } else {
            try {
                pinMatches = BCrypt.checkpw(request.getPin(), customer.getPin());
            } catch (Exception e) {}
        }
        if (!pinMatches) {
            throw new IllegalArgumentException("Incorrect PIN.");
        }
        
        String method = request.getDepositMethod() != null ? request.getDepositMethod() : "CASH";
        String senderName = method.equals("B2B_TRANSFER") ? "B2B Transfer" : 
                            method.equals("BANK_LOAN") ? "Bank Loan" : "Cash Deposit";

        double newBalance = customer.getBalance() + request.getAmount();
        customer.setBalance(newBalance);
        customerRepository.save(customer);

        Transaction transaction = new Transaction(
                senderName,
                customer.getName(),
                request.getAmount(),
                "Deposit",
                customer
        );
        transaction.setSenderAccountNumber("N/A");
        transaction.setSenderIban("N/A");
        transaction.setReceiverAccountNumber(customer.getAccountNumber());
        transaction.setReceiverIban(customer.getIban());
        transaction.setDepositMethod(method);
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

        boolean pinMatches = false;
        if (customer.getPin().length() == 4 && customer.getPin().matches("\\d{4}")) {
            if (customer.getPin().equals(request.getPin())) pinMatches = true;
        } else {
            try {
                pinMatches = BCrypt.checkpw(request.getPin(), customer.getPin());
            } catch (Exception e) {}
        }
        if (!pinMatches) {
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
        transaction.setSenderAccountNumber(customer.getAccountNumber());
        transaction.setSenderIban(customer.getIban());
        transaction.setReceiverAccountNumber("N/A");
        transaction.setReceiverIban("N/A");
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
        
        boolean pinMatches = false;
        if (sender.getPin().length() == 4 && sender.getPin().matches("\\d{4}")) {
            if (sender.getPin().equals(request.getPin())) pinMatches = true;
        } else {
            try {
                pinMatches = BCrypt.checkpw(request.getPin(), sender.getPin());
            } catch (Exception e) {}
        }
        if (!pinMatches) {
            throw new IllegalArgumentException("Incorrect PIN.");
        }

        String identifier = request.getReceiverIdentifier();
        Customer receiver = customerRepository.findByAccountNumber(identifier)
                .orElseGet(() -> customerRepository.findByIban(identifier)
                        .orElseThrow(() -> new IllegalArgumentException("Receiver account or IBAN not found.")));

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
        senderTx.setSenderAccountNumber(sender.getAccountNumber());
        senderTx.setSenderIban(sender.getIban());
        senderTx.setReceiverAccountNumber(receiver.getAccountNumber());
        senderTx.setReceiverIban(receiver.getIban());
        transactionRepository.save(senderTx);

        // Record transaction for receiver
        Transaction receiverTx = new Transaction(
                sender.getName(),
                receiver.getName(),
                request.getAmount(),
                "Bank Transfer",
                receiver
        );
        receiverTx.setSenderAccountNumber(sender.getAccountNumber());
        receiverTx.setSenderIban(sender.getIban());
        receiverTx.setReceiverAccountNumber(receiver.getAccountNumber());
        receiverTx.setReceiverIban(receiver.getIban());
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
            entry.put("senderAccountNumber", t.getSenderAccountNumber());
            entry.put("senderIban", t.getSenderIban());
            entry.put("receiverAccountNumber", t.getReceiverAccountNumber());
            entry.put("receiverIban", t.getReceiverIban());
            entry.put("depositMethod", t.getDepositMethod());
            result.add(entry);
        }
        return result;
    }
}

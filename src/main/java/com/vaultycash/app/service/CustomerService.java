package com.vaultycash.app.service;

import com.vaultycash.app.dto.*;
import com.vaultycash.app.model.Customer;
import com.vaultycash.app.repository.CustomerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.mindrot.jbcrypt.BCrypt;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Random;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;

    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @Transactional
    public LoginResponse register(RegisterRequest request) {
        // Validate required fields
        if (request.getName() == null || request.getName().isBlank()) {
            throw new IllegalArgumentException("Name is required.");
        }
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new IllegalArgumentException("Email is required.");
        }
        if (request.getPhone() == null || request.getPhone().isBlank()) {
            throw new IllegalArgumentException("Phone number is required.");
        }
        if (request.getPassword() == null || request.getPassword().length() < 6) {
            throw new IllegalArgumentException("Password must be at least 6 characters.");
        }
        if (request.getPin() == null || !request.getPin().matches("\\d{4}")) {
            throw new IllegalArgumentException("PIN must be exactly 4 digits.");
        }
        if (request.getAge() < 18) {
            throw new IllegalArgumentException("You must be at least 18 years old.");
        }
        if (customerRepository.existsByPhoneNumber(request.getPhone())) {
            throw new IllegalArgumentException("Phone number already registered.");
        }

        // Generate account number and IBAN
        long count = customerRepository.count();
        String accountNumber = "ACC" + (count + 1);
        String iban = "PK00BANK" + (count + 1);

        // Generate card details
        Random rand = new Random();
        StringBuilder cardBuilder = new StringBuilder("4");
        for (int i = 0; i < 15; i++) {
            cardBuilder.append(rand.nextInt(10));
        }
        String cardNumber = cardBuilder.toString();
        String cvv = String.format("%03d", rand.nextInt(1000));
        LocalDate expiry = LocalDate.now().plusYears(5);
        String cardExpiry = expiry.format(DateTimeFormatter.ofPattern("MM/yy"));

        Customer customer = new Customer(
                request.getName(),
                request.getAge(),
                request.getGender(),
                request.getEmail(),
                request.getPhone(),
                BCrypt.hashpw(request.getPassword(), BCrypt.gensalt()),
                BCrypt.hashpw(request.getPin(), BCrypt.gensalt()),
                request.getBalance(),
                accountNumber,
                iban,
                cardNumber,
                cvv,
                cardExpiry
        );

        Customer saved = customerRepository.save(customer);

        return toLoginResponse(saved);
    }

    public LoginResponse login(LoginRequest request) {
        Customer customer = customerRepository.findByPhoneNumber(request.getPhone())
                .orElseThrow(() -> new IllegalArgumentException("Incorrect phone number or password."));

        boolean passwordMatches = false;
        boolean needsUpgrade = false;

        try {
            passwordMatches = BCrypt.checkpw(request.getPassword(), customer.getPassword());
        } catch (IllegalArgumentException e) {
            // Not a valid BCrypt hash (legacy plaintext password)
            if (customer.getPassword().equals(request.getPassword())) {
                passwordMatches = true;
                needsUpgrade = true; // Upgrade the plaintext password to BCrypt
            }
        }

        if (!passwordMatches) {
            throw new IllegalArgumentException("Incorrect phone number or password.");
        }

        // Seamlessly upgrade plaintext passwords to BCrypt
        if (needsUpgrade) {
            customer.setPassword(BCrypt.hashpw(request.getPassword(), BCrypt.gensalt()));
            customerRepository.save(customer);
        }

        return toLoginResponse(customer);
    }

    public LoginResponse getProfile(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found."));
        return toLoginResponse(customer);
    }

    @Transactional
    public LoginResponse updateProfile(Long id, EditProfileRequest request) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found."));

        if (request.getName() == null || request.getName().isBlank()) {
            throw new IllegalArgumentException("Name is required.");
        }
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new IllegalArgumentException("Email is required.");
        }
        if (request.getPhone() == null || request.getPhone().isBlank()) {
            throw new IllegalArgumentException("Phone number is required.");
        }

        customer.setName(request.getName());
        customer.setEmail(request.getEmail());
        customer.setPhoneNumber(request.getPhone());

        Customer saved = customerRepository.save(customer);
        return toLoginResponse(saved);
    }

    @Transactional
    public void changePassword(ChangePasswordRequest request) {
        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new IllegalArgumentException("Customer not found."));

        if (!BCrypt.checkpw(request.getOldPassword(), customer.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect.");
        }
        if (request.getNewPassword() == null || request.getNewPassword().length() < 6) {
            throw new IllegalArgumentException("New password must be at least 6 characters.");
        }
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("Passwords do not match.");
        }

        customer.setPassword(BCrypt.hashpw(request.getNewPassword(), BCrypt.gensalt()));
        customerRepository.save(customer);
    }

    @Transactional
    public void changePin(ChangePinRequest request) {
        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new IllegalArgumentException("Customer not found."));

        boolean pinMatches = false;
        if (customer.getPin().length() == 4 && customer.getPin().matches("\\d{4}")) {
            // Fallback for plaintext old pins
            if (customer.getPin().equals(request.getOldPin())) {
                pinMatches = true;
            }
        } else {
            try {
                pinMatches = BCrypt.checkpw(request.getOldPin(), customer.getPin());
            } catch (Exception e) {
                pinMatches = false;
            }
        }

        if (!pinMatches) {
            throw new IllegalArgumentException("Current PIN is incorrect.");
        }
        if (request.getNewPin() == null || !request.getNewPin().matches("\\d{4}")) {
            throw new IllegalArgumentException("New PIN must be 4 digits.");
        }
        if (!request.getNewPin().equals(request.getConfirmPin())) {
            throw new IllegalArgumentException("PINs do not match.");
        }

        customer.setPin(BCrypt.hashpw(request.getNewPin(), BCrypt.gensalt()));
        customerRepository.save(customer);
    }

    private LoginResponse toLoginResponse(Customer customer) {
        if (customer.getCardNumber() == null || customer.getCardNumber().isBlank()) {
            Random rand = new Random();
            StringBuilder cardBuilder = new StringBuilder("4");
            for (int i = 0; i < 15; i++) {
                cardBuilder.append(rand.nextInt(10));
            }
            customer.setCardNumber(cardBuilder.toString());
            customer.setCvv(String.format("%03d", rand.nextInt(1000)));
            customer.setCardExpiry(LocalDate.now().plusYears(5).format(DateTimeFormatter.ofPattern("MM/yy")));
            customerRepository.save(customer);
        }

        String maskedCard = "**** **** **** " + customer.getCardNumber().substring(12);

        return new LoginResponse(
                customer.getId(),
                customer.getName(),
                customer.getAge(),
                customer.getGender(),
                customer.getEmail(),
                customer.getPhoneNumber(),
                customer.getBalance(),
                customer.getAccountNumber(),
                customer.getIban(),
                maskedCard,
                customer.getCardExpiry()
        );
    }
}

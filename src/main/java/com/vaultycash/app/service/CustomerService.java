package com.vaultycash.app.service;

import com.vaultycash.app.dto.*;
import com.vaultycash.app.model.Customer;
import com.vaultycash.app.repository.CustomerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.mindrot.jbcrypt.BCrypt;

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

        Customer customer = new Customer(
                request.getName(),
                request.getAge(),
                request.getGender(),
                request.getEmail(),
                request.getPhone(),
                BCrypt.hashpw(request.getPassword(), BCrypt.gensalt()),
                request.getPin(),
                request.getBalance(),
                accountNumber,
                iban
        );

        Customer saved = customerRepository.save(customer);

        return toLoginResponse(saved);
    }

    public LoginResponse login(LoginRequest request) {
        Customer customer = customerRepository.findByPhoneNumber(request.getPhone())
                .orElseThrow(() -> new IllegalArgumentException("Incorrect phone number or password."));

        if (!BCrypt.checkpw(request.getPassword(), customer.getPassword())) {
            throw new IllegalArgumentException("Incorrect phone number or password.");
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

        if (!customer.getPin().equals(request.getOldPin())) {
            throw new IllegalArgumentException("Current PIN is incorrect.");
        }
        if (request.getNewPin() == null || !request.getNewPin().matches("\\d{4}")) {
            throw new IllegalArgumentException("New PIN must be 4 digits.");
        }
        if (!request.getNewPin().equals(request.getConfirmPin())) {
            throw new IllegalArgumentException("PINs do not match.");
        }

        customer.setPin(request.getNewPin());
        customerRepository.save(customer);
    }

    private LoginResponse toLoginResponse(Customer customer) {
        return new LoginResponse(
                customer.getId(),
                customer.getName(),
                customer.getAge(),
                customer.getGender(),
                customer.getEmail(),
                customer.getPhoneNumber(),
                customer.getPin(),
                customer.getBalance(),
                customer.getAccountNumber(),
                customer.getIban()
        );
    }
}

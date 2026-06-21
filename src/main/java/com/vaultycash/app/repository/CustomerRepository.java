package com.vaultycash.app.repository;

import com.vaultycash.app.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {

    Optional<Customer> findByPhoneNumber(String phoneNumber);

    Optional<Customer> findByAccountNumber(String accountNumber);

    boolean existsByPhoneNumber(String phoneNumber);

    long count();
}

package com.PrintLab.repository;

import com.PrintLab.modal.Customer;
import com.PrintLab.modal.ProductDefinition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomerRepository extends JpaRepository<Customer,Long> {
    List<Customer> findByStatus(String status);
}

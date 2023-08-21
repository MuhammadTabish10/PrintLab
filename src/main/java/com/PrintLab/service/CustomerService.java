package com.PrintLab.service;

import com.PrintLab.dto.CustomerDto;
import com.PrintLab.modal.Customer;

import java.util.List;

public interface CustomerService {
    List<CustomerDto> findAll();

    CustomerDto findById(Long id);

    CustomerDto save(CustomerDto customerDto);

    String deleteById(Long id);

    CustomerDto updateCustomer(Long id, Customer customer);
}

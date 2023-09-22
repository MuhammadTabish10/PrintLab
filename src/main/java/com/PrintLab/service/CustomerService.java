package com.PrintLab.service;

import com.PrintLab.dto.CustomerDto;
import com.PrintLab.model.Customer;

import java.util.List;

public interface CustomerService {
    List<CustomerDto> findAll();
    CustomerDto findById(Long id);
    List<CustomerDto> searchByName(String name);
    CustomerDto save(CustomerDto customerDto);
    String deleteById(Long id);
    CustomerDto updateCustomer(Long id, Customer customer);
}

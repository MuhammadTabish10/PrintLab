package com.PrintLab.service.impl;

import com.PrintLab.dto.CustomerDto;
import com.PrintLab.exception.RecordNotFoundException;
import com.PrintLab.model.Customer;
import com.PrintLab.repository.CustomerRepository;
import com.PrintLab.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {

    @Autowired
    CustomerRepository customerRepository;

    @Override
    public List<CustomerDto> findAll() {
        return customerRepository.findByStatus("Active").stream()
                .map(this::toDto).collect(Collectors.toList());
    }

    @Override
    public CustomerDto findById(Long id) {
        Optional<Customer> customerId = customerRepository.findById(id);
        if(customerId.isPresent()) {
            return toDto(customerId.get());
        }
        else {
            throw new RecordNotFoundException(String.format("Customer not found on id => %d", id));
        }
    }

    @Override
    public List<CustomerDto> searchByName(String name) {
        List<Customer> customerList = customerRepository.findCustomerByName(name);
        List<CustomerDto> customerDtoList = new ArrayList<>();

        for (Customer customer : customerList) {
            CustomerDto customerDto = toDto(customer);
            customerDtoList.add(customerDto);
        }
        return customerDtoList;
    }

    @Override
    @Transactional
    public CustomerDto save(CustomerDto customerDto) {
        customerDto.setStatus("Active");
        Customer saved = customerRepository.save(toEntity(customerDto));
        return toDto(saved);
    }

    @Override
    @Transactional
    public String deleteById(Long id) {
        Optional<Customer> deleteCustomer = customerRepository.findById(id);
        if(deleteCustomer.isPresent()) {
            customerRepository.setStatusInactive(id);
        }
        else{
            throw new RecordNotFoundException(String.format("Customer not found on id => %d", id));
        }
        return null;
    }

    @Override
    @Transactional
    public CustomerDto updateCustomer(Long id, Customer customer) {
        Optional<Customer> updateCustomer = customerRepository.findById(id);
        if(updateCustomer.isPresent()){
            Customer existedCustomer = updateCustomer.get();
            existedCustomer.setName(customer.getName());
            existedCustomer.setBusinessName(customer.getBusinessName());
            existedCustomer.setStatus(customer.getStatus());
            Customer updatedCustomer = customerRepository.save(existedCustomer);
            return toDto(updatedCustomer);
        }
        else {
            throw new RecordNotFoundException(String.format("Customer not found on id => %d", id));
        }
    }



    public Customer toEntity(CustomerDto customerDto) {
            return Customer.builder()
                    .id(customerDto.getId())
                    .name(customerDto.getName())
                    .createdAt(customerDto.getCreatedAt())
                    .businessName(customerDto.getBusinessName())
                    .status(customerDto.getStatus())
                    .build();
    }
    public CustomerDto toDto(Customer customer){
        return CustomerDto.builder()
                .id(customer.getId())
                .name(customer.getName())
                .createdAt(customer.getCreatedAt())
                .businessName(customer.getBusinessName())
                .status(customer.getStatus())
                .build();
    }
}

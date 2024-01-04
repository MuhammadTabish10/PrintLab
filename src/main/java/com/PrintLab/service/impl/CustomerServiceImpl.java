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
            existedCustomer.setTitle(customer.getTitle());
            existedCustomer.setName(customer.getName());
            existedCustomer.setMiddleName(customer.getMiddleName());
            existedCustomer.setLastName(customer.getLastName());
            existedCustomer.setEmail(customer.getEmail());
            existedCustomer.setPhoneNo(customer.getPhoneNo());
            existedCustomer.setWebsite(customer.getWebsite());
            existedCustomer.setBusinessName(customer.getBusinessName());
            existedCustomer.setSubCustomer(customer.isSubCustomer());
            existedCustomer.setParentCustomerId(customer.getParentCustomerId());
            existedCustomer.setBillParentCustomer(customer.isBillParentCustomer());
            existedCustomer.setBillingStreetAddress(customer.getBillingStreetAddress());
            existedCustomer.setBillingCity(customer.getBillingCity());
            existedCustomer.setBillingProvince(customer.getBillingProvince());
            existedCustomer.setBillingPostalCode(customer.getBillingPostalCode());
            existedCustomer.setBillingCountry(customer.getBillingCountry());
            existedCustomer.setSameAsBilling(customer.isSameAsBilling());
            existedCustomer.setShippingStreetAddress(customer.getShippingStreetAddress());
            existedCustomer.setShippingCity(customer.getShippingCity());
            existedCustomer.setShippingProvince(customer.getShippingProvince());
            existedCustomer.setShippingPostalCode(customer.getShippingPostalCode());
            existedCustomer.setShippingCountry(customer.getShippingCountry());
            existedCustomer.setOpeningBalance(customer.getOpeningBalance());
            existedCustomer.setAsOf(customer.getAsOf());
            existedCustomer.setPrimaryPaymentMethod(customer.getPrimaryPaymentMethod());
            existedCustomer.setTerms(customer.getTerms());
            existedCustomer.setTax(customer.getTax());
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
                    .title(customerDto.getTitle())
                    .name(customerDto.getName())
                    .middleName(customerDto.getMiddleName())
                    .lastName(customerDto.getLastName())
                    .email(customerDto.getEmail())
                    .phoneNo(customerDto.getPhoneNo())
                    .website(customerDto.getWebsite())
                    .createdAt(customerDto.getCreatedAt())
                    .businessName(customerDto.getBusinessName())
                    .isSubCustomer(customerDto.isSubCustomer())
                    .parentCustomerId(customerDto.getParentCustomerId())
                    .billParentCustomer(customerDto.isBillParentCustomer())
                    .billingStreetAddress(customerDto.getBillingStreetAddress())
                    .billingCity(customerDto.getBillingCity())
                    .sameAsBilling(customerDto.isSameAsBilling())
                    .billingProvince(customerDto.getBillingProvince())
                    .billingPostalCode(customerDto.getBillingPostalCode())
                    .billingCountry(customerDto.getBillingCountry())
                    .shippingStreetAddress(customerDto.getShippingStreetAddress())
                    .shippingCity(customerDto.getShippingCity())
                    .shippingProvince(customerDto.getShippingProvince())
                    .shippingPostalCode(customerDto.getShippingPostalCode())
                    .shippingCountry(customerDto.getShippingCountry())
                    .openingBalance(customerDto.getOpeningBalance())
                    .asOf(customerDto.getAsOf())
                    .primaryPaymentMethod(customerDto.getPrimaryPaymentMethod())
                    .terms(customerDto.getTerms())
                    .tax(customerDto.getTax())
                    .status(customerDto.getStatus())
                    .build();
    }
    public CustomerDto toDto(Customer customer){
        return CustomerDto.builder()
                .id(customer.getId())
                .title(customer.getTitle())
                .name(customer.getName())
                .middleName(customer.getMiddleName())
                .lastName(customer.getLastName())
                .email(customer.getEmail())
                .phoneNo(customer.getPhoneNo())
                .website(customer.getWebsite())
                .createdAt(customer.getCreatedAt())
                .businessName(customer.getBusinessName())
                .isSubCustomer(customer.isSubCustomer())
                .parentCustomerId(customer.getParentCustomerId())
                .billParentCustomer(customer.isBillParentCustomer())
                .sameAsBilling(customer.isSameAsBilling())
                .billingStreetAddress(customer.getBillingStreetAddress())
                .billingCity(customer.getBillingCity())
                .billingProvince(customer.getBillingProvince())
                .billingPostalCode(customer.getBillingPostalCode())
                .billingCountry(customer.getBillingCountry())
                .shippingStreetAddress(customer.getShippingStreetAddress())
                .shippingCity(customer.getShippingCity())
                .shippingProvince(customer.getShippingProvince())
                .shippingPostalCode(customer.getShippingPostalCode())
                .shippingCountry(customer.getShippingCountry())
                .openingBalance(customer.getOpeningBalance())
                .asOf(customer.getAsOf())
                .primaryPaymentMethod(customer.getPrimaryPaymentMethod())
                .terms(customer.getTerms())
                .tax(customer.getTax())
                .status(customer.getStatus())
                .build();
    }
}

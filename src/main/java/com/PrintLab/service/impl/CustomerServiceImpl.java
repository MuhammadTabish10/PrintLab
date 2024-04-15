package com.PrintLab.service.impl;

import com.PrintLab.dto.BusinessBranchDto;
import com.PrintLab.dto.BusinessDto;
import com.PrintLab.dto.CustomerDto;
import com.PrintLab.exception.RecordNotFoundException;
import com.PrintLab.model.Business;
import com.PrintLab.model.BusinessBranch;
import com.PrintLab.model.Customer;
import com.PrintLab.repository.BusinessBranchRepository;
import com.PrintLab.repository.BusinessRepository;
import com.PrintLab.repository.CustomerRepository;
import com.PrintLab.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {

    @Autowired
    CustomerRepository customerRepository;
    @Autowired
    BusinessRepository businessRepository;
    @Autowired
    BusinessBranchRepository branchRepository;

    @Override
    public List<CustomerDto> findAll() {
        return customerRepository.findByStatus("Active").stream()
                .map(this::toDto).collect(Collectors.toList());
    }

    @Override
    public CustomerDto findById(Long id) {
        Optional<Customer> customerId = customerRepository.findById(id);
        if (customerId.isPresent()) {
            return toDto(customerId.get());
        } else {
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
        // Convert DTO to entity
        Customer customer = toEntity(customerDto);
        customer.setStatus("Active");
        customer.setCreatedAt(LocalDate.now());
        // Iterate over each Business in the Customer entity
        for (Business business : customer.getCustomerBusinessName()) {
            // Set the Customer reference for each Business
            business.setCustomer(customer);
            business.setId(null); // Set Business id to null

            // Iterate over each BusinessBranch in the Business entity
            for (BusinessBranch branch : business.getBusinessBranchList()) {
                // Set the Business reference for each BusinessBranch
                branch.setBusiness(business);
                branch.setId(null); // Set BusinessBranch id to null
            }
        }

        // Save the Customer entity
        Customer savedCustomer = customerRepository.save(customer);

        // Convert the saved Customer entity back to DTO and return
        return toDto(savedCustomer);
    }


    @Override
    @Transactional
    public String deleteById(Long id) {
        Optional<Customer> deleteCustomer = customerRepository.findById(id);
        if (deleteCustomer.isPresent()) {
            customerRepository.setStatusInactive(id);
        } else {
            throw new RecordNotFoundException(String.format("Customer not found on id => %d", id));
        }
        return null;
    }

    @Override
    @Transactional
    public CustomerDto updateCustomer(Long id, Customer customer) {
        Optional<Customer> updateCustomerOpt = customerRepository.findById(id);
        if (updateCustomerOpt.isPresent()) {
            Customer existingCustomer = updateCustomerOpt.get();

            // Update customer details
            existingCustomer.setName(customer.getName());
            existingCustomer.setEmail(customer.getEmail());
            existingCustomer.setWhatsApp(customer.getWhatsApp());
            existingCustomer.setMobileNo(customer.getMobileNo());
            existingCustomer.setStatusId(customer.getStatusId());
            existingCustomer.setSince(customer.getSince());
            existingCustomer.setLeadOwner(customer.getLeadOwner());
            existingCustomer.setClientStatus(customer.isClientStatus());
            existingCustomer.setClientPreferred(customer.getClientPreferred());
            existingCustomer.setPrimaryPaymentMethod(customer.getPrimaryPaymentMethod());
            existingCustomer.setTerms(customer.getTerms());
            existingCustomer.setTax(customer.getTax());
            existingCustomer.setNotes(customer.getNotes());
            existingCustomer.setShowLead(customer.isShowLead());

            // Remove existing entities that are not present in the updated list
            removeBusinessesNotPresent(existingCustomer.getCustomerBusinessName(), customer.getCustomerBusinessName());

            // Update or save associated businesses
            List<Business> updatedBusinessList = new ArrayList<>();
            for (Business business : customer.getCustomerBusinessName()) {
                Business existingBusiness = null;
                if (business.getId() != null) {
                    // Find the corresponding existing business by ID
                    Optional<Business> optionalExistingBusiness = existingCustomer.getCustomerBusinessName().stream()
                            .filter(b -> b.getId().equals(business.getId()))
                            .findFirst();
                    if (optionalExistingBusiness.isPresent()) {
                        existingBusiness = optionalExistingBusiness.get();
                    }
                }
                if (existingBusiness == null) {
                    // If business ID is not present or business not found, save it as a new one
                    Business savedBusiness = businessRepository.save(business);
                    // Set the customer for the new business
                    savedBusiness.setCustomer(existingCustomer);
                    existingCustomer.getCustomerBusinessName().add(savedBusiness);
                    existingBusiness = savedBusiness;
                }

                // Update business details
                existingBusiness.setBusinessName(business.getBusinessName());

                removeBranchesNotPresent(existingBusiness.getBusinessBranchList(), business.getBusinessBranchList());


                // Update or save associated branches
                List<BusinessBranch> updatedBranchList = new ArrayList<>();
                for (BusinessBranch branch : business.getBusinessBranchList()) {
                    BusinessBranch existingBranch = null;
                    if (branch.getId() != null) {
                        // Find the corresponding existing branch by ID
                        Optional<BusinessBranch> optionalExistingBranch = existingBusiness.getBusinessBranchList().stream()
                                .filter(b -> b.getId().equals(branch.getId()))
                                .findFirst();
                        if (optionalExistingBranch.isPresent()) {
                            existingBranch = optionalExistingBranch.get();
                        }
                    }
                    if (existingBranch == null) {
                        // If branch ID is not present or branch not found, save it as a new one
                        BusinessBranch savedBranch = branchRepository.save(branch);
                        // Set the business for the new branch
                        savedBranch.setBusiness(existingBusiness);
                        existingBusiness.getBusinessBranchList().add(savedBranch);
                        existingBranch = savedBranch;
                    }

                    // Update branch details
                    existingBranch.setBranchName(branch.getBranchName());
                    existingBranch.setAddress(branch.getAddress());
                    existingBranch.setCity(branch.getCity());
                    existingBranch.setPointOfContact(branch.getPointOfContact());
                    existingBranch.setPhoneNumber(branch.getPhoneNumber());

                    updatedBranchList.add(existingBranch);
                }
                existingBusiness.setBusinessBranchList(updatedBranchList);
                updatedBusinessList.add(existingBusiness);
            }

            existingCustomer.setCustomerBusinessName(updatedBusinessList);

            // Save and return updated customer
            Customer updatedCustomer = customerRepository.save(existingCustomer);
            return toDto(updatedCustomer);
        } else {
            throw new RecordNotFoundException(String.format("Customer not found on id => %d", id));
        }
    }

    private void removeBusinessesNotPresent(List<Business> existingBusinesses, List<Business> updatedBusinesses) {
        for (int i = existingBusinesses.size() - 1; i >= 0; i--) {
            Business existingBusiness = existingBusinesses.get(i);
            boolean found = false;
            for (Business updatedBusiness : updatedBusinesses) {
                if (updatedBusiness.getId() != null && updatedBusiness.getId().equals(existingBusiness.getId())) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                businessRepository.delete(existingBusiness);
                existingBusinesses.remove(existingBusiness);
            }
        }
    }

    private void removeBranchesNotPresent(List<BusinessBranch> existingBranches, List<BusinessBranch> updatedBranches) {
        for (int i = existingBranches.size() - 1; i >= 0; i--) {
            BusinessBranch existingBranch = existingBranches.get(i);
            boolean found = false;
            for (BusinessBranch updatedBranch : updatedBranches) {
                if (updatedBranch.getId() != null && updatedBranch.getId().equals(existingBranch.getId())) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                branchRepository.delete(existingBranch);
                existingBranches.remove(existingBranch);
            }
        }
    }


    public Customer toEntity(CustomerDto customerDto) {
        // Map Business objects
        List<Business> businessList = customerDto.getCustomerBusinessName().stream()
                .map(businessDto -> {
                    Business business = Business.builder()
                            .id(businessDto.getId())
                            .businessName(businessDto.getBusinessName())
                            .build();

                    // Map BusinessBranch objects for each Business
                    List<BusinessBranch> businessBranchList = businessDto.getBusinessBranchList().stream()
                            .map(branchDto -> BusinessBranch.builder()
                                    .id(branchDto.getId())
                                    .branchName(branchDto.getBranchName())
                                    .address(branchDto.getAddress())
                                    .city(branchDto.getCity())
                                    .pointOfContact(branchDto.getPointOfContact())
                                    .phoneNumber(branchDto.getPhoneNumber())
                                    .build())
                            .collect(Collectors.toList());

                    business.setBusinessBranchList(businessBranchList);
                    return business;
                })
                .collect(Collectors.toList());

        // Map Customer object
        return Customer.builder()
                .id(customerDto.getId())
                .name(customerDto.getName())
                .email(customerDto.getEmail())
                .whatsApp(customerDto.getWhatsApp())
                .mobileNo(customerDto.getMobileNo())
                .statusId(customerDto.getStatusId())
                .since(customerDto.getSince())
                .leadOwner(customerDto.getLeadOwner())
                .clientStatus(customerDto.isClientStatus())
                .createdAt(customerDto.getCreatedAt())
                .customerBusinessName(businessList)
                .clientPreferred(customerDto.getClientPreferred())
                .primaryPaymentMethod(customerDto.getPrimaryPaymentMethod())
                .terms(customerDto.getTerms())
                .tax(customerDto.getTax())
                .notes(customerDto.getNotes())
                .showLead(customerDto.isShowLead())
                .status(customerDto.getStatus())
                .build();
    }


    public CustomerDto toDto(Customer customer) {
        // Map BusinessDto objects for each Business
        List<BusinessDto> businessDtoList = customer.getCustomerBusinessName().stream()
                .map(business -> {
                    // Map BusinessBranchDto objects for each BusinessBranch
                    List<BusinessBranchDto> branchDtoList = business.getBusinessBranchList().stream()
                            .map(branch -> BusinessBranchDto.builder()
                                    .id(branch.getId())
                                    .branchName(branch.getBranchName())
                                    .address(branch.getAddress())
                                    .city(branch.getCity())
                                    .pointOfContact(branch.getPointOfContact())
                                    .phoneNumber(branch.getPhoneNumber())
                                    .build())
                            .collect(Collectors.toList());

                    return BusinessDto.builder()
                            .id(business.getId())
                            .businessName(business.getBusinessName())
                            .businessBranchList(branchDtoList)
                            .build();
                })
                .collect(Collectors.toList());

        // Map CustomerDto object
        return CustomerDto.builder()
                .id(customer.getId())
                .name(customer.getName())
                .email(customer.getEmail())
                .whatsApp(customer.getWhatsApp())
                .mobileNo(customer.getMobileNo())
                .statusId(customer.getStatusId())
                .since(customer.getSince())
                .leadOwner(customer.getLeadOwner())
                .clientStatus(customer.isClientStatus())
                .createdAt(customer.getCreatedAt())
                .customerBusinessName(businessDtoList)
                .clientPreferred(customer.getClientPreferred())
                .primaryPaymentMethod(customer.getPrimaryPaymentMethod())
                .terms(customer.getTerms())
                .tax(customer.getTax())
                .notes(customer.getNotes())
                .showLead(customer.isShowLead())
                .status(customer.getStatus())
                .build();
    }

}

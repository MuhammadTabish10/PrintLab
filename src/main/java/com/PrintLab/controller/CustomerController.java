package com.PrintLab.controller;
import com.PrintLab.dto.CustomerDto;
import com.PrintLab.model.Customer;
import com.PrintLab.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
public class CustomerController {

    @Autowired
    CustomerService customerService;

    @PostMapping("/customer")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<CustomerDto> saveCustomer(@RequestBody CustomerDto customerDto) {
        CustomerDto savedCustomer = customerService.save(customerDto);
        return ResponseEntity.ok(savedCustomer);
    }
    @GetMapping("/customer")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<CustomerDto>> findAll(){
        List<CustomerDto> customer = customerService.findAll();
        return ResponseEntity.ok(customer);
    }
    @GetMapping("/customer/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<CustomerDto> getCustomerById(@PathVariable Long id) {
        CustomerDto customerDto = customerService.findById(id);
        return ResponseEntity.ok(customerDto);
    }

    @GetMapping("/customers/{name}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<CustomerDto>> getAllCustomersByName(@PathVariable String name) {
        List<CustomerDto> customerDtoList = customerService.searchByName(name);
        return ResponseEntity.ok(customerDtoList);
    }

    @DeleteMapping("/customer/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<String> deleteCustomer(@PathVariable Long id) {
        customerService.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/customer/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<CustomerDto> updateCustomer(@PathVariable Long id, @RequestBody Customer customer) {
        CustomerDto updatedCustomer = customerService.updateCustomer(id, customer);
        return ResponseEntity.ok(updatedCustomer);
    }
}

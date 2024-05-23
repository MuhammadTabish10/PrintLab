package com.PrintLab.controller;//package com.PrintLab.controller;

import com.PrintLab.dto.BusinessDto;
import com.PrintLab.model.Business;
import com.PrintLab.service.BusinessService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/businesses")
public class BusinessController {

    @Autowired
    private BusinessService businessService;

    @GetMapping
    public ResponseEntity<List<BusinessDto>> getAllBusinesses() {
        List<BusinessDto> businesses = businessService.getAllBusinesses();
        return ResponseEntity.ok(businesses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Business> getBusinessById(@PathVariable Long id) {
        Business business = businessService.getBusinessById(id);
        return ResponseEntity.ok(business);
    }

    @PostMapping
    public ResponseEntity<?> createBusiness(@RequestBody BusinessDto businessDto) {
        try {
            BusinessDto createdBusiness = businessService.createBusiness(businessDto);
            return new ResponseEntity<>(createdBusiness, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new Object() {
                        public final String error = "A similar business already exists.";
                    });
        }
    }


    @PutMapping("/{id}")
    public ResponseEntity<BusinessDto> updateBusiness(@PathVariable Long id, @RequestBody BusinessDto businessDto) {
        BusinessDto business = businessService.updateBusiness(id, businessDto);
        return ResponseEntity.ok(business);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBusiness(@PathVariable Long id) {
        businessService.deleteBusiness(id);
        return ResponseEntity.noContent().build();
    }
    @DeleteMapping("/branch/{id}")
    public ResponseEntity<Void> deleteBranch(@PathVariable Long id) {
        businessService.deleteBranch(id);
        return ResponseEntity.noContent().build();
    }
}

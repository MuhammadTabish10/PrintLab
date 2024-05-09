package com.PrintLab.controller;

import com.PrintLab.dto.ProductRuleJobDto;
import com.PrintLab.service.ProductRuleJobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/product-rule-jobs")
public class ProductRuleJobController {

    @Autowired
    private ProductRuleJobService productRuleJobService;

    @GetMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<ProductRuleJobDto>> getAllProductRuleJobs() {
        List<ProductRuleJobDto> productRuleJobDtoList = productRuleJobService.findAll();
        return ResponseEntity.ok(productRuleJobDtoList);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ProductRuleJobDto> getProductRuleJobById(@PathVariable Long id) {
        ProductRuleJobDto productRuleJobDto = productRuleJobService.getById(id);
        return ResponseEntity.ok(productRuleJobDto);
    }

    @PostMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ProductRuleJobDto> createProductRuleJob(@RequestBody ProductRuleJobDto productRuleJobDto) {
        ProductRuleJobDto createdProductRuleJobDto = productRuleJobService.save(productRuleJobDto);
        return ResponseEntity.ok(createdProductRuleJobDto);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_CUSTOMER_SUPPORT')")
    public ResponseEntity<ProductRuleJobDto> updateProductRuleJob(@PathVariable Long id, @RequestBody ProductRuleJobDto productRuleJobDto) {
        ProductRuleJobDto updatedProductRuleJobDto = productRuleJobService.update(id, productRuleJobDto);
        return ResponseEntity.ok(updatedProductRuleJobDto);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Void> deleteProductRuleJob(@PathVariable Long id) {
        productRuleJobService.delete(id);
        return ResponseEntity.ok().build();
    }
    @GetMapping("/check-title/{productName}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Boolean> checkTitle(@PathVariable String productName){
        return ResponseEntity.ok(productRuleJobService.checkTitle(productName));
    }

    @GetMapping("/get-by-name/{name}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_CUSTOMER_SUPPORT')")
    public ResponseEntity<List<ProductRuleJobDto>> getProductRuleJobByName(@PathVariable String name) {
        List<ProductRuleJobDto> productRuleJobDtoList = productRuleJobService.searchByProductName(name);
        return ResponseEntity.ok(productRuleJobDtoList);
    }
}

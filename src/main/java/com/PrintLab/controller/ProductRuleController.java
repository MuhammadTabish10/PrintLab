package com.PrintLab.controller;

import com.PrintLab.dto.ProductRuleDto;
import com.PrintLab.service.ProductRuleService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ProductRuleController {
    private final ProductRuleService productRuleService;

    public ProductRuleController(ProductRuleService productRuleService) {
        this.productRuleService = productRuleService;
    }

    @PostMapping("/product-rule")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ProductRuleDto> createProductRule(@RequestBody ProductRuleDto productRuleDto){
        return ResponseEntity.ok(productRuleService.save(productRuleDto));
    }

    @GetMapping("/product-rule/check-title/{title}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Boolean> checkTitle(@PathVariable String title){
        return ResponseEntity.ok(productRuleService.checkTitle(title));
    }

    @GetMapping("/product-rule")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<ProductRuleDto>> getAllProductRule() {
        List<ProductRuleDto> productRuleDtoList = productRuleService.getAllProductRule();
        return ResponseEntity.ok(productRuleDtoList);
    }

    @GetMapping("/product-rule/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_PRODUCTION', 'ROLE_DESIGNER', 'ROLE_PLATE_SETTER')")
    public ResponseEntity<ProductRuleDto> getProductRuleById(@PathVariable Long id) {
        ProductRuleDto productRuleDto = productRuleService.getProductRuleById(id);
        return ResponseEntity.ok(productRuleDto);
    }

    @GetMapping("/product-rule/names/{name}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<ProductRuleDto>> getProductRuleByName(@PathVariable String name) {
        List<ProductRuleDto> productRuleDtoList = productRuleService.searchByTitle(name);
        return ResponseEntity.ok(productRuleDtoList);
    }

    @DeleteMapping("/product-rule/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Void> deleteProductRule(@PathVariable Long id) {
        productRuleService.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/product-rule/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ProductRuleDto> updateProductRule(@PathVariable Long id, @RequestBody ProductRuleDto productRuleDto) {
        ProductRuleDto updatedProductRule = productRuleService.update(id, productRuleDto);
        return ResponseEntity.ok(updatedProductRule);
    }
}

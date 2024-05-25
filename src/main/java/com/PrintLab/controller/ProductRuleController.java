package com.PrintLab.controller;

import com.PrintLab.dto.PaginationResponse;
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

    @GetMapping("/product-rule/check-title")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Boolean> checkTitle(@RequestParam String productName, @RequestParam String type) {
        return ResponseEntity.ok(productRuleService.checkTitle(productName, type));
    }

    @GetMapping("/product-rule")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_CUSTOMER_SUPPORT')")
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

    @GetMapping("/product-rule/names")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<ProductRuleDto>> getProductRuleByName(@RequestParam String productName) {
        List<ProductRuleDto> productRuleDtoList = productRuleService.searchByName(productName);
        return ResponseEntity.ok(productRuleDtoList);
    }


    @GetMapping("/product-rule/all-groupSheet")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<ProductRuleDto>> getAllProductRuleByGroupSheetIsTrue() {
        List<ProductRuleDto> productRuleDtoList = productRuleService.getAllProductRuleInGroupSheet();
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

    @PostMapping("/get-paginated-productRule")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<PaginationResponse> findAll(
            @RequestParam(value = "page-number", defaultValue = "0", required = false) Integer pageNumber,
            @RequestParam(value = "page-size", defaultValue = "10", required = false) Integer pageSize,
            @RequestBody ProductRuleDto productRuleDto
    ) {
        PaginationResponse paginationResponse = productRuleService.getAllPaginatedProductRule(pageNumber, pageSize, productRuleDto);
        return ResponseEntity.ok(paginationResponse);
    }

    @GetMapping("/product-rule-by-type/{type}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<ProductRuleDto>> getProductRuleByType(@RequestParam String type) {
        List<ProductRuleDto> productRuleDtoList = productRuleService.findAllByType(type);
        return ResponseEntity.ok(productRuleDtoList);
    }
}

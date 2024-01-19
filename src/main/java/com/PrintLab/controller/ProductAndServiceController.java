package com.PrintLab.controller;

import com.PrintLab.dto.ProductAndServiceDto;
import com.PrintLab.service.ProductAndServiceService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ProductAndServiceController {

    private final ProductAndServiceService productAndServiceService;

    public ProductAndServiceController(ProductAndServiceService productAndServiceService) {
        this.productAndServiceService = productAndServiceService;
    }

    @PostMapping("/product-and-service")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ProductAndServiceDto> createProductAndService(@RequestBody ProductAndServiceDto productAndServiceDto) {
        return ResponseEntity.ok(productAndServiceService.save(productAndServiceDto));
    }

    @GetMapping("/product-and-service")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<ProductAndServiceDto>> getAllProductAndService() {
        List<ProductAndServiceDto> productAndServiceList = productAndServiceService.getAll();
        return ResponseEntity.ok(productAndServiceList);
    }

    @GetMapping("/product-and-service/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ProductAndServiceDto> getProductAndServiceById(@PathVariable Long id) {
        ProductAndServiceDto productAndServiceDto = productAndServiceService.findById(id);
        return ResponseEntity.ok(productAndServiceDto);
    }

    @DeleteMapping("/product-and-service/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<String> deleteProductAndService(@PathVariable Long id) {
        productAndServiceService.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/product-and-service/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ProductAndServiceDto> updateProductAndService(@PathVariable Long id, @RequestBody ProductAndServiceDto productAndServiceDto) {
        ProductAndServiceDto updatedProductAndServiceDto = productAndServiceService.updateProductAndService(id, productAndServiceDto);
        return ResponseEntity.ok(updatedProductAndServiceDto);
    }
}

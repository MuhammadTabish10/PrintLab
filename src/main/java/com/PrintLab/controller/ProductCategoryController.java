package com.PrintLab.controller;

import com.PrintLab.dto.ProductCategoryDto;
import com.PrintLab.service.ProductCategoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ProductCategoryController {
    private final ProductCategoryService productCategoryService;

    public ProductCategoryController(ProductCategoryService productCategoryService) {
        this.productCategoryService = productCategoryService;
    }

    @PostMapping("/product-category")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ProductCategoryDto> createProductCategory(@RequestBody ProductCategoryDto productCategoryDto) {
        return ResponseEntity.ok(productCategoryService.save(productCategoryDto));
    }

    @GetMapping("/product-category")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<ProductCategoryDto>> getAllProductCategory() {
        List<ProductCategoryDto> productCategoryList = productCategoryService.getAll();
        return ResponseEntity.ok(productCategoryList);
    }

    @GetMapping("/product-sub-category-by/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<ProductCategoryDto>> getAllSubCategoryByCategory(@PathVariable Long id) {
        List<ProductCategoryDto> productCategoryDtoList = productCategoryService.searchByCategory(id);
        return ResponseEntity.ok(productCategoryDtoList);
    }

    @GetMapping("/product-category/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ProductCategoryDto> getCtpById(@PathVariable Long id) {
        ProductCategoryDto productCategoryDto = productCategoryService.findById(id);
        return ResponseEntity.ok(productCategoryDto);
    }

    @DeleteMapping("/product-category/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<String> deleteCtp(@PathVariable Long id) {
        productCategoryService.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/product-category/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ProductCategoryDto> updateProductCategory(@PathVariable Long id, @RequestBody ProductCategoryDto productCategoryDto) {
        ProductCategoryDto updatedProductCategoryDto = productCategoryService.updatedProductCategory(id, productCategoryDto);
        return ResponseEntity.ok(updatedProductCategoryDto);
    }
}

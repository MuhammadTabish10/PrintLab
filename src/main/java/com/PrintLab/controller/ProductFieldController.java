package com.PrintLab.controller;

import com.PrintLab.dto.ProductFieldDto;
import com.PrintLab.dto.ProductFieldValuesDto;
import com.PrintLab.modal.ProductField;
import com.PrintLab.modal.ProductFieldValues;
import com.PrintLab.service.ProductFieldService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/productField")
public class ProductFieldController {

    private final ProductFieldService productFieldService;

    public ProductFieldController(ProductFieldService productFieldService) {
        this.productFieldService = productFieldService;
    }

    @PostMapping
    public ResponseEntity<ProductFieldDto> createProductField(@RequestBody ProductFieldDto productFieldDto) {
        try {
            return ResponseEntity.ok(productFieldService.save(productFieldDto));
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/{productFieldId}/productFieldValues")
    public ResponseEntity<ProductFieldValues> saveProductFieldValue(@PathVariable Long productFieldId, @RequestBody ProductFieldValues productFieldValues) {
        ProductFieldValues saveProductFieldValue = productFieldService.addProductFieldValues(productFieldId, productFieldValues);
        return ResponseEntity.ok(saveProductFieldValue);
    }

    @GetMapping
    public ResponseEntity<List<ProductFieldDto>> getAllProductField() {
        List<ProductFieldDto> productFieldDtoList = productFieldService.getAll();
        return ResponseEntity.ok(productFieldDtoList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductFieldDto> getProductFieldById(@PathVariable Long id) {
        try {
            ProductFieldDto productFieldDto = productFieldService.findById(id);
            return ResponseEntity.ok(productFieldDto);
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProductField(@PathVariable Long id) {
        productFieldService.deleteById(id);
        return ResponseEntity.ok("Product Field with ID " + id + " has been deleted.");
    }

    @DeleteMapping("/{id}/{pfvId}")
    public ResponseEntity<String> deleteProductionFieldValues(@PathVariable Long id, @PathVariable Long pfvId) {
        productFieldService.deleteProductFieldValuesById(id, pfvId);
        return ResponseEntity.ok("Product Field Values with ID " + pfvId + "has been Deleted");
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductFieldDto> updateProductField(@PathVariable Long id, @RequestBody ProductField productField) {
        try {
            ProductFieldDto updatedPfDto = productFieldService.updatedProductField(id, productField);
            return ResponseEntity.ok(updatedPfDto);
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}

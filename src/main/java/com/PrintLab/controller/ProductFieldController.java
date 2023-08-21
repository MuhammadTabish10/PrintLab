package com.PrintLab.controller;

import com.PrintLab.dto.ProductFieldDto;
import com.PrintLab.modal.ProductField;
import com.PrintLab.service.ProductFieldService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/product-field")
public class ProductFieldController {

    private final ProductFieldService productFieldService;

    public ProductFieldController(ProductFieldService productFieldService) {
        this.productFieldService = productFieldService;
    }

    @PostMapping
    public ResponseEntity<ProductFieldDto> createProductField(@RequestBody ProductFieldDto productFieldDto) {
        return ResponseEntity.ok(productFieldService.save(productFieldDto));
    }

    @GetMapping
    public ResponseEntity<List<ProductFieldDto>> getAllProductField() {
        List<ProductFieldDto> productFieldDtoList = productFieldService.getAll();
        return ResponseEntity.ok(productFieldDtoList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductFieldDto> getProductFieldById(@PathVariable Long id) {
        ProductFieldDto productFieldDto = productFieldService.findById(id);
        return ResponseEntity.ok(productFieldDto);
    }

    @GetMapping("/name/{name}")
    public ResponseEntity<ProductFieldDto> getProductFieldByName(@PathVariable String name) {
        ProductFieldDto productFieldDto = productFieldService.findByName(name);
        return ResponseEntity.ok(productFieldDto);
    }

    @GetMapping("/{id}/product-field-value")
    public ResponseEntity<List<ProductFieldDto>> getProductFieldByProductFieldValueId(@PathVariable Long id) {
        List<ProductFieldDto> productFieldDtoList = productFieldService.getProductFieldByProductFieldValueId(id);
        return ResponseEntity.ok(productFieldDtoList);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProductField(@PathVariable Long id) {
        productFieldService.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}/{pfvId}")
    public ResponseEntity<String> deleteProductionFieldValues(@PathVariable Long id, @PathVariable Long pfvId) {
        productFieldService.deleteProductFieldValuesById(id, pfvId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductFieldDto> updateProductField(@PathVariable Long id, @RequestBody ProductField productField) {
        ProductFieldDto updatedPfDto = productFieldService.updatedProductField(id, productField);
        return ResponseEntity.ok(updatedPfDto);
    }
}

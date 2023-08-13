package com.PrintLab.controller;

import com.PrintLab.dto.ProductDefinitionDto;
import com.PrintLab.service.ProductDefinitionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/productDefinition")
public class ProductDefinitionController {

    private final ProductDefinitionService productDefinitionService;

    public ProductDefinitionController(ProductDefinitionService productDefinitionService) {
        this.productDefinitionService = productDefinitionService;
    }

    @PostMapping
    public ResponseEntity<ProductDefinitionDto> saveProductionDefinition(@RequestBody ProductDefinitionDto productDefinitionDto) {
        return ResponseEntity.ok(productDefinitionService.save(productDefinitionDto));
    }

    @GetMapping
    public ResponseEntity<List<ProductDefinitionDto>> getAllProductDefinition() {
        List<ProductDefinitionDto> productDefinitionDtoList = productDefinitionService.getAll();
        return ResponseEntity.ok(productDefinitionDtoList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDefinitionDto> getProductDefinitionById(@PathVariable Long id) {
        ProductDefinitionDto productDefinitionDto = productDefinitionService.findById(id);
        return ResponseEntity.ok(productDefinitionDto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductDefinitionDto> updateProductDefinition(@PathVariable Long id, @RequestBody ProductDefinitionDto productDefinitionDto) {
        ProductDefinitionDto updateProductDefinitionDto = productDefinitionService.updateProductDefinition(id, productDefinitionDto);
        return ResponseEntity.ok(updateProductDefinitionDto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProductDefinition(@PathVariable Long id) {
        productDefinitionService.deleteProductDefinition(id);
        return ResponseEntity.ok("Product Definition with ID " + id + "has been deleted");
    }

    @DeleteMapping("/{id}/{pdfId}/product-definition-field")
    public ResponseEntity<String> deleteProductDefinitionField(@PathVariable Long id, @PathVariable Long pdfId) {
        productDefinitionService.deleteProductDefinitionFieldById(id,pdfId);
        return ResponseEntity.ok("Product Definition Field with ID " + pdfId + "has been deleted");
    }

    @DeleteMapping("/{id}/{pdpId}/product-definition-process")
    public ResponseEntity<String> deleteProductDefinitionProcess(@PathVariable Long id, @PathVariable Long pdpId) {
        productDefinitionService.deleteProductDefinitionProcessById(id,pdpId);
        return ResponseEntity.ok("Product Definition Process with ID " + pdpId + "has been deleted");
    }
}

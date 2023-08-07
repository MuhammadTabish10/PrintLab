package com.PrintLab.controller;

import com.PrintLab.dto.ProductDefinitionDto;
import com.PrintLab.modal.ProductDefinition;
import com.PrintLab.modal.ProductDefinitionField;
import com.PrintLab.modal.ProductField;
import com.PrintLab.service.ProductDefinitionService;
import org.springframework.http.HttpStatus;
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
        try {
            return ResponseEntity.ok(productDefinitionService.save(productDefinitionDto));
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/{productDefinitionId}/productField")
    public ResponseEntity<ProductField> saveProductFieldWithProductDefinition(@PathVariable Long productDefinitionId, @RequestBody ProductField productField) {
        ProductField savedProductField = productDefinitionService.addProductField(productDefinitionId, productField);
        return ResponseEntity.ok(savedProductField);
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
    public ResponseEntity<ProductDefinitionDto> updateProductDefinition(@PathVariable Long id, @RequestBody ProductDefinition productDefinition) {
        ProductDefinitionDto updateProductDefinitionDto = productDefinitionService.updateProductDefinition(id, productDefinition);
        return ResponseEntity.ok(updateProductDefinitionDto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProductDefinition(@PathVariable Long id) {
        productDefinitionService.deleteProductDefinition(id);
        return ResponseEntity.ok("Product Definition with ID " + id + "has been deleted");
    }

}

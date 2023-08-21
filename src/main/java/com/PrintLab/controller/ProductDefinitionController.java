package com.PrintLab.controller;

import com.PrintLab.dto.ProductDefinitionDto;
import com.PrintLab.service.ProductDefinitionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/product-definition")
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

    @GetMapping("/title/{title}")
    public ResponseEntity<ProductDefinitionDto> getProductDefinitionByTitle(@PathVariable String title) {
        ProductDefinitionDto productDefinitionDto = productDefinitionService.findByTitle(title);
        return ResponseEntity.ok(productDefinitionDto);
    }

    @GetMapping("/{id}/product-field")
    public ResponseEntity<List<ProductDefinitionDto>> getProductDefinitionByProductFieldId(@PathVariable Long id) {
        List<ProductDefinitionDto> productDefinitionDtoList = productDefinitionService.getProductDefinitionByProductFieldId(id);
        return ResponseEntity.ok(productDefinitionDtoList);
    }

    @GetMapping("/{id}/product-process")
    public ResponseEntity<List<ProductDefinitionDto>> getProductDefinitionByProductProcessId(@PathVariable Long id) {
        List<ProductDefinitionDto> productDefinitionDtoList = productDefinitionService.getProductDefinitionByProductProcessId(id);
        return ResponseEntity.ok(productDefinitionDtoList);
    }

    @GetMapping("/{id}/vendor")
    public ResponseEntity<List<ProductDefinitionDto>> getProductDefinitionByVendorId(@PathVariable Long id) {
        List<ProductDefinitionDto> productDefinitionDtoList = productDefinitionService.getProductDefinitionByVendorId(id);
        return ResponseEntity.ok(productDefinitionDtoList);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductDefinitionDto> updateProductDefinition(@PathVariable Long id, @RequestBody ProductDefinitionDto productDefinitionDto) {
        ProductDefinitionDto updateProductDefinitionDto = productDefinitionService.updateProductDefinition(id, productDefinitionDto);
        return ResponseEntity.ok(updateProductDefinitionDto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProductDefinition(@PathVariable Long id) {
        productDefinitionService.deleteProductDefinition(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}/{pdfId}/product-definition-field")
    public ResponseEntity<String> deleteProductDefinitionField(@PathVariable Long id, @PathVariable Long pdfId) {
        productDefinitionService.deleteProductDefinitionFieldById(id,pdfId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}/{pdpId}/product-definition-process")
    public ResponseEntity<String> deleteProductDefinitionProcess(@PathVariable Long id, @PathVariable Long pdpId) {
        productDefinitionService.deleteProductDefinitionProcessById(id,pdpId);
        return ResponseEntity.ok().build();
    }
}

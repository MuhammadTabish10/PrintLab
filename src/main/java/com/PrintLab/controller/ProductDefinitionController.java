package com.PrintLab.controller;

import com.PrintLab.dto.ProductDefinitionDto;
import com.PrintLab.service.ProductDefinitionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ProductDefinitionDto> saveProductionDefinition(@RequestBody ProductDefinitionDto productDefinitionDto) {
        return ResponseEntity.ok(productDefinitionService.save(productDefinitionDto));
    }

    @GetMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<ProductDefinitionDto>> getAllProductDefinition() {
        List<ProductDefinitionDto> productDefinitionDtoList = productDefinitionService.getAll();
        return ResponseEntity.ok(productDefinitionDtoList);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ProductDefinitionDto> getProductDefinitionById(@PathVariable Long id) {
        ProductDefinitionDto productDefinitionDto = productDefinitionService.findById(id);
        return ResponseEntity.ok(productDefinitionDto);
    }

    @GetMapping("/title/{title}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ProductDefinitionDto> getProductDefinitionByTitle(@PathVariable String title) {
        ProductDefinitionDto productDefinitionDto = productDefinitionService.findByTitle(title);
        return ResponseEntity.ok(productDefinitionDto);
    }

    @GetMapping("/titles/{title}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<ProductDefinitionDto>> getAllProductDefinitionsByTitle(@PathVariable String title) {
        List<ProductDefinitionDto> productProcessDtoList = productDefinitionService.searchByTitle(title);
        return ResponseEntity.ok(productProcessDtoList);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ProductDefinitionDto> updateProductDefinition(@PathVariable Long id, @RequestBody ProductDefinitionDto productDefinitionDto) {
        ProductDefinitionDto updateProductDefinitionDto = productDefinitionService.updateProductDefinition(id, productDefinitionDto);
        return ResponseEntity.ok(updateProductDefinitionDto);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<String> deleteProductDefinition(@PathVariable Long id) {
        productDefinitionService.deleteProductDefinition(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}/new-product/{new-product-id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<String> deleteNewProductFromProductDefinition(@PathVariable Long id,@PathVariable(name = "new-product-id") Long newProductId) {
        productDefinitionService.deleteNewProductById(id,newProductId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}/new-product/{new-product-id}/product-gsm/{gsm-id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<String> deleteProductGsmFromNewProduct(@PathVariable Long id, @PathVariable(name = "new-product-id") Long newProductId, @PathVariable(name = "gsm-id") Long gsmId){
        productDefinitionService.deleteProductGsmById(id,newProductId,gsmId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}/{pdfId}/product-definition-field")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<String> deleteProductDefinitionField(@PathVariable Long id, @PathVariable Long pdfId) {
        productDefinitionService.deleteNewProductById(id,pdfId);
        return ResponseEntity.ok().build();
    }
}

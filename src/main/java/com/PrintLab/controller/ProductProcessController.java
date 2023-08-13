package com.PrintLab.controller;

import com.PrintLab.dto.ProductProcessDto;
import com.PrintLab.modal.ProductProcess;
import com.PrintLab.service.ProductProcessService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/product-process")
public class ProductProcessController
{
    public final ProductProcessService productProcessService;
    public ProductProcessController(ProductProcessService productProcessService) {
        this.productProcessService = productProcessService;
    }

    @PostMapping
    public ResponseEntity<ProductProcessDto> createProductProcess(@RequestBody ProductProcessDto productProcessDto){
        return ResponseEntity.ok(productProcessService.save(productProcessDto));
    }

    @GetMapping
    public ResponseEntity<List<ProductProcessDto>> getAllProductProcess() {
        List<ProductProcessDto> productProcessDto = productProcessService.getAll();
        return ResponseEntity.ok(productProcessDto);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductProcessDto> getProductProcessById(@PathVariable Long id) {
        ProductProcessDto productProcessDto = productProcessService.findById(id);
        return ResponseEntity.ok(productProcessDto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProductProcess(@PathVariable Long id) {
        productProcessService.deleteById(id);
        return ResponseEntity.ok("ProductProcess with ID " + id + " has been deleted.");
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductProcessDto> updateProductProcess(@PathVariable Long id, @RequestBody ProductProcess productProcess) {
        ProductProcessDto updatedProductProcessDto = productProcessService.updateProductProcess(id, productProcess);
        return ResponseEntity.ok(updatedProductProcessDto);
    }
}

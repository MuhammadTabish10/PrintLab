package com.PrintLab.controller;

import com.PrintLab.dto.InventoryDto;
import com.PrintLab.dto.PaperMarketRatesDto;
import com.PrintLab.service.InventoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class InventoryController {
    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @PostMapping("/inventory")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<InventoryDto> createInventory(@RequestBody InventoryDto inventoryDto) {
        return ResponseEntity.ok(inventoryService.save(inventoryDto));
    }

    @GetMapping("/inventory")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<InventoryDto>> getAllInventory() {
        List<InventoryDto> inventoryList = inventoryService.getAll();
        return ResponseEntity.ok(inventoryList);
    }

    @GetMapping("/inventory/paper-stock/{stock}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<InventoryDto>> getAllInventoryByPaperStock(@PathVariable String stock) {
        List<InventoryDto> inventoryDtoList = inventoryService.searchByPaperStock(stock);
        return ResponseEntity.ok(inventoryDtoList);
    }

    @GetMapping("/inventory/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<InventoryDto> getInventoryById(@PathVariable Long id) {
        InventoryDto inventoryDto = inventoryService.findById(id);
        return ResponseEntity.ok(inventoryDto);
    }

    @DeleteMapping("/inventory/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<String> deleteInventory(@PathVariable Long id) {
        inventoryService.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/inventory/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<InventoryDto> updateInventory(@PathVariable Long id, @RequestBody InventoryDto inventoryDto) {
        InventoryDto updatedInventoryDto = inventoryService.updateInventory(id, inventoryDto);
        return ResponseEntity.ok(updatedInventoryDto);
    }

    @PutMapping("/inventory/{id}/paper-market-rates")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> updatePaperMarketRatesFromInventory(@PathVariable Long id) {
        PaperMarketRatesDto paperMarketRatesDto = inventoryService.updatePaperMarketRate(id);
        return ResponseEntity.ok(paperMarketRatesDto);
    }
}

package com.PrintLab.controller;

import com.PrintLab.dto.VendorSettlementDto;
import com.PrintLab.service.VendorSettlementService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class VendorSettlementController {
    private final VendorSettlementService vendorSettlementService;

    public VendorSettlementController(VendorSettlementService vendorSettlementService) {
        this.vendorSettlementService = vendorSettlementService;
    }

    @PostMapping("/vendor-settlement")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<VendorSettlementDto> createVendorSettlement(@RequestBody VendorSettlementDto vendorSettlementDto) {
        return ResponseEntity.ok(vendorSettlementService.save(vendorSettlementDto));
    }

    @GetMapping("/vendor-settlement")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_PRODUCTION', 'ROLE_DESIGNER', 'ROLE_PLATE_SETTER')")
    public ResponseEntity<List<VendorSettlementDto>> getAllVendorSettlements() {
        List<VendorSettlementDto> vendorSettlementDtoList = vendorSettlementService.getAll();
        return ResponseEntity.ok(vendorSettlementDtoList);
    }

    @GetMapping("/vendor-settlement/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_PRODUCTION', 'ROLE_DESIGNER', 'ROLE_PLATE_SETTER')")
    public ResponseEntity<VendorSettlementDto> getVendorSettlementById(@PathVariable Long id) {
        VendorSettlementDto vendorSettlementDto = vendorSettlementService.findById(id);
        return ResponseEntity.ok(vendorSettlementDto);
    }

    @DeleteMapping("/vendor-settlement/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<String> deleteVendorSettlement(@PathVariable Long id) {
        vendorSettlementService.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/vendor-settlement/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<VendorSettlementDto> updateVendorSettlement(@PathVariable Long id, @RequestBody VendorSettlementDto vendorSettlementDto) {
        VendorSettlementDto updatedVendorSettlementDto = vendorSettlementService.update(id, vendorSettlementDto);
        return ResponseEntity.ok(updatedVendorSettlementDto);
    }
}

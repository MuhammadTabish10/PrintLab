package com.PrintLab.controller;

import com.PrintLab.dto.VendorDto;
import com.PrintLab.service.VendorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vendor")
public class VendorController
{
    public final VendorService vendorService;
    public VendorController(VendorService vendorService) {
        this.vendorService = vendorService;
    }

    @PostMapping
    public ResponseEntity<VendorDto> createVendor(@RequestBody VendorDto vendorDto){
        return ResponseEntity.ok(vendorService.save(vendorDto));
    }

    @GetMapping
    public ResponseEntity<List<VendorDto>> getAllVendors() {
        List<VendorDto> vendorDtoList = vendorService.getAll();
        return ResponseEntity.ok(vendorDtoList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<VendorDto> getVendorById(@PathVariable Long id) {
        VendorDto vendorDto = vendorService.findById(id);
        return ResponseEntity.ok(vendorDto);
    }

    @GetMapping("/{id}/product-process")
    public ResponseEntity<List<VendorDto>> getVendorByProductProcessId(@PathVariable Long id) {
        List<VendorDto> vendorDtoList = vendorService.getVendorByProcessId(id);
        return ResponseEntity.ok(vendorDtoList);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteVendor(@PathVariable Long id) {
        vendorService.deleteById(id);
        return ResponseEntity.ok("Vendor with ID " + id + " has been deleted.");
    }

    @DeleteMapping("/{id}/{vendor-process-id}")
    public ResponseEntity<String> deleteVendorProcess(@PathVariable Long id, @PathVariable(name = "vendor-process-id") Long pvId) {
        vendorService.deleteVendorProcessById(id,pvId);
        return ResponseEntity.ok("Vendor Process with ID " + pvId + " has been deleted.");
    }

    @PutMapping("/{id}")
    public ResponseEntity<VendorDto> updateVendor(@PathVariable Long id, @RequestBody VendorDto vendorDto) {
        VendorDto updatedVendorDto = vendorService.updateVendor(id, vendorDto);
        return ResponseEntity.ok(updatedVendorDto);
    }
}

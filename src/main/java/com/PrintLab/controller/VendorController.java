package com.PrintLab.controller;

import com.PrintLab.dto.PressMachineDto;
import com.PrintLab.dto.VendorDto;
import com.PrintLab.service.VendorService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<VendorDto> createVendor(@RequestBody VendorDto vendorDto){
        return ResponseEntity.ok(vendorService.save(vendorDto));
    }

    @GetMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<VendorDto>> getAllVendors() {
        List<VendorDto> vendorDtoList = vendorService.getAll();
        return ResponseEntity.ok(vendorDtoList);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<VendorDto> getVendorById(@PathVariable Long id) {
        VendorDto vendorDto = vendorService.findById(id);
        return ResponseEntity.ok(vendorDto);
    }

    @GetMapping("/name/{name}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<VendorDto> getVendorByName(@PathVariable String name) {
        VendorDto vendorDto = vendorService.findByName(name);
        return ResponseEntity.ok(vendorDto);
    }

    @GetMapping("/names/{name}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<VendorDto>> getVendorsByName(@PathVariable String name) {
        List<VendorDto> vendorDtoList = vendorService.searchByName(name);
        return ResponseEntity.ok(vendorDtoList);
    }

    @GetMapping("/{id}/product-process")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<VendorDto>> getVendorByProductProcessId(@PathVariable Long id) {
        List<VendorDto> vendorDtoList = vendorService.getVendorByProcessId(id);
        return ResponseEntity.ok(vendorDtoList);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<String> deleteVendor(@PathVariable Long id) {
        vendorService.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}/{vendor-process-id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<String> deleteVendorProcess(@PathVariable Long id, @PathVariable(name = "vendor-process-id") Long pvId) {
        vendorService.deleteVendorProcessById(id,pvId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<VendorDto> updateVendor(@PathVariable Long id, @RequestBody VendorDto vendorDto) {
        VendorDto updatedVendorDto = vendorService.updateVendor(id, vendorDto);
        return ResponseEntity.ok(updatedVendorDto);
    }
}

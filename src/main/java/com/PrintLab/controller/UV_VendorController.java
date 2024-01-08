package com.PrintLab.controller;

import com.PrintLab.dto.UV_VendorDto;
import com.PrintLab.model.UV_Vendor;
import com.PrintLab.service.UV_VendorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class UV_VendorController {
    @Autowired
    UV_VendorService uvVendorService;

    @PostMapping("/uv-vendor")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<UV_VendorDto> saveVendor(@RequestBody UV_VendorDto uvVendorDto) {
        UV_VendorDto savedVendor = uvVendorService.save(uvVendorDto);
        return ResponseEntity.ok(savedVendor);
    }
    @GetMapping("/uv-vendor")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<UV_VendorDto>> findAll(){
        List<UV_VendorDto> uvVendorDtoList = uvVendorService.findAll();
        return ResponseEntity.ok(uvVendorDtoList);
    }
    @GetMapping("/uv-vendor/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<UV_VendorDto> getVendorById(@PathVariable Long id) {
        UV_VendorDto uvVendorDto = uvVendorService.findById(id);
        return ResponseEntity.ok(uvVendorDto);
    }

    @GetMapping("/uv-vendors/{name}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<UV_VendorDto>> getAllVendorsByName(@PathVariable String name) {
        List<UV_VendorDto> uvVendorDtoList = uvVendorService.searchByName(name);
        return ResponseEntity.ok(uvVendorDtoList);
    }

    @DeleteMapping("/uv-vendor/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<String> deleteVendor(@PathVariable Long id) {
        uvVendorService.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/uv-vendor/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<UV_VendorDto> updateVendor(@PathVariable Long id, @RequestBody UV_Vendor uvVendor) {
        UV_VendorDto updatedVendor = uvVendorService.updateVendor(id, uvVendor);
        return ResponseEntity.ok(updatedVendor);
    }
}

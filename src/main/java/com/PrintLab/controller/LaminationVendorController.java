package com.PrintLab.controller;

import com.PrintLab.dto.LaminationVendorDto;
import com.PrintLab.model.LaminationVendor;
import com.PrintLab.service.LaminationVendorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api")
public class LaminationVendorController {
    @Autowired
    LaminationVendorService laminationVendorService;

    @PostMapping("/lamination-vendor")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<LaminationVendorDto> saveVendor(@RequestBody LaminationVendorDto laminationVendorDto) {
        LaminationVendorDto savedVendor = laminationVendorService.save(laminationVendorDto);
        return ResponseEntity.ok(savedVendor);
    }
    @GetMapping("/lamination-vendor")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<LaminationVendorDto>> findAll(){
        List<LaminationVendorDto> bindingLabourDtoList = laminationVendorService.findAll();
        return ResponseEntity.ok(bindingLabourDtoList);
    }
    @GetMapping("/lamination-vendor/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<LaminationVendorDto> getVendorById(@PathVariable Long id) {
        LaminationVendorDto laminationVendorDto = laminationVendorService.findById(id);
        return ResponseEntity.ok(laminationVendorDto);
    }

    @GetMapping("/lamination-vendors/{name}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<LaminationVendorDto>> getAllVendorsByName(@PathVariable String name) {
        List<LaminationVendorDto> laminationVendorDtoList = laminationVendorService.searchByName(name);
        return ResponseEntity.ok(laminationVendorDtoList);
    }

    @DeleteMapping("/lamination-vendor/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<String> deleteVendor(@PathVariable Long id) {
        laminationVendorService.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/lamination-vendor/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<LaminationVendorDto> updateVendor(@PathVariable Long id, @RequestBody LaminationVendor laminationVendor) {
        LaminationVendorDto updatedVendor = laminationVendorService.updateVendor(id, laminationVendor);
        return ResponseEntity.ok(updatedVendor);
    }
}

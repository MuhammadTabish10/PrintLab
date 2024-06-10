package com.PrintLab.controller;

import com.PrintLab.dto.VendorContactsDto;
import com.PrintLab.model.VendorContacts;
import com.PrintLab.service.impl.VendorContactsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class VendorContactsController {

    @Autowired
    private VendorContactsServiceImpl vendorContactsService;

    @PostMapping("/vendorContacts")
    public ResponseEntity<VendorContactsDto> saveVendorContacts(@RequestBody VendorContactsDto vendorContactsDto) {
        VendorContacts savedVendorContacts = vendorContactsService.save(vendorContactsDto);
        if (savedVendorContacts != null) {
            VendorContactsDto savedDto = vendorContactsService.toDto(savedVendorContacts);
            return ResponseEntity.ok(savedDto);
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/vendorContacts")
    public ResponseEntity<List<VendorContactsDto>> findAllVendorContacts() {
        List<VendorContacts> vendorContactsList = vendorContactsService.findAll();
        List<VendorContactsDto> dtoList = vendorContactsList.stream()
                .map(vendorContactsService::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtoList);
    }

    @GetMapping("/vendorContacts/{id}")
    public ResponseEntity<VendorContactsDto> findVendorContactsById(@PathVariable Long id) {
        Optional<VendorContacts> vendorContactsOptional = vendorContactsService.findById(id);
        return vendorContactsOptional.map(vendorContacts -> ResponseEntity.ok(vendorContactsService.toDto(vendorContacts)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/vendorContacts/{id}")
    public ResponseEntity<VendorContactsDto> updateVendorContacts(@PathVariable Long id, @RequestBody VendorContactsDto vendorContactsDto) {
        VendorContacts updatedVendorContacts = vendorContactsService.update(id, vendorContactsDto);
        if (updatedVendorContacts != null) {
            VendorContactsDto updatedDto = vendorContactsService.toDto(updatedVendorContacts);
            return ResponseEntity.ok(updatedDto);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/vendorContacts/{id}")
    public ResponseEntity<Void> deleteVendorContacts(@PathVariable Long id) {
        vendorContactsService.delete(id);
        return ResponseEntity.noContent().build();
    }
}


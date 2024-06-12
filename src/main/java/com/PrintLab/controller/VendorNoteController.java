package com.PrintLab.controller;

import com.PrintLab.dto.VendorDto;
import com.PrintLab.model.VendorNote;
import com.PrintLab.service.VendorNoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class VendorNoteController {
    private VendorNoteService vendorNoteService;

    @PostMapping("/vendorNote")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<VendorNote> createVendorNote(@RequestBody VendorNote vendorNote) {
        return ResponseEntity.ok(vendorNoteService.addNote(vendorNote));
    }

    @GetMapping("/vendorNote/vendor/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<VendorNote>> getAllNotesByVendor(@PathVariable Long id) {
        List<VendorNote> vendorNoteList = vendorNoteService.getAllNotesByVendor(id);
        return ResponseEntity.ok(vendorNoteList);
    }

}

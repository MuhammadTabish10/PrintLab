package com.PrintLab.controller;

import com.PrintLab.dto.CtpDto;
import com.PrintLab.service.CtpService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class CtpController {
    private final CtpService ctpService;

    public CtpController(CtpService ctpService) {
        this.ctpService = ctpService;
    }

    @PostMapping("/ctp")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<CtpDto> createCtp(@RequestBody CtpDto ctpDto) {
        return ResponseEntity.ok(ctpService.save(ctpDto));
    }

    @GetMapping("/ctp")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<CtpDto>> getAllCtp() {
        List<CtpDto> ctpList = ctpService.getAll();
        return ResponseEntity.ok(ctpList);
    }

    @GetMapping("/ctp/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<CtpDto> getCtpById(@PathVariable Long id) {
        CtpDto ctpDto = ctpService.getById(id);
        return ResponseEntity.ok(ctpDto);
    }

    @DeleteMapping("/ctp/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<String> deleteCtp(@PathVariable Long id) {
        ctpService.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/ctp/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<CtpDto> updateCtp(@PathVariable Long id, @RequestBody CtpDto ctpDto) {
        CtpDto updatedCtpDto = ctpService.update(id, ctpDto);
        return ResponseEntity.ok(updatedCtpDto);
    }
}

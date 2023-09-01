package com.PrintLab.controller;

import com.PrintLab.dto.PaperSizeDto;
import com.PrintLab.dto.PressMachineDto;
import com.PrintLab.service.impl.PaperSizeServiceImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/paper-size")
public class PaperSizeController
{
    private final PaperSizeServiceImpl paperSizeService;

    public PaperSizeController(PaperSizeServiceImpl paperSizeService) {
        this.paperSizeService = paperSizeService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<PaperSizeDto> createPaperSize(@RequestBody PaperSizeDto paperSizeDto) {
        return ResponseEntity.ok(paperSizeService.save(paperSizeDto));
    }

    @GetMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<PaperSizeDto>> getAllPaperSize() {
        List<PaperSizeDto> paperSizeDtoList = paperSizeService.getAll();
        return ResponseEntity.ok(paperSizeDtoList);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<PaperSizeDto> getPaperSizeById(@PathVariable Long id) {
        PaperSizeDto paperSizeDto = paperSizeService.findById(id);
        return ResponseEntity.ok(paperSizeDto);
    }

    @GetMapping("/label/{label}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<PaperSizeDto> getPaperSizeByLabel(@PathVariable String label) {
        PaperSizeDto paperSizeDtoList = paperSizeService.findByLabel(label);
        return ResponseEntity.ok(paperSizeDtoList);
    }

    @GetMapping("/labels/{label}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<PaperSizeDto>> getPaperSizesByLabel(@PathVariable String label) {
        List<PaperSizeDto> paperSizeDtoList = paperSizeService.searchByLabel(label);
        return ResponseEntity.ok(paperSizeDtoList);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<String> deletePaperSize(@PathVariable Long id) {
        paperSizeService.deleteById(id);
        return ResponseEntity.ok().build();    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<PaperSizeDto> updatePaperSize(@PathVariable Long id, @RequestBody PaperSizeDto paperSizeDto) {
        PaperSizeDto updatedPsDto = paperSizeService.updatePaperSize(id, paperSizeDto);
        return ResponseEntity.ok(updatedPsDto);
    }
}

package com.PrintLab.controller;

import com.PrintLab.dto.PaperStockDto;
import com.PrintLab.service.PaperStockService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/paper-stock")
public class PaperStockController {
    private final PaperStockService paperStockService;

    public PaperStockController(PaperStockService paperStockService) {
        this.paperStockService = paperStockService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<PaperStockDto> createPaperStock(@RequestBody PaperStockDto paperStockDto) {
        return ResponseEntity.ok(paperStockService.save(paperStockDto));
    }

    @GetMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<PaperStockDto>> getAllPaperStock() {
        List<PaperStockDto> paperStockDtoList = paperStockService.getAll();
        return ResponseEntity.ok(paperStockDtoList);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<PaperStockDto> getPaperStockById(@PathVariable Long id) {
        PaperStockDto paperStockDto = paperStockService.findById(id);
        return ResponseEntity.ok(paperStockDto);
    }

    @GetMapping("/names/{name}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<PaperStockDto>> getPaperStockByName(@PathVariable String name) {
        List<PaperStockDto> paperStockDtoList = paperStockService.searchByName(name);
        return ResponseEntity.ok(paperStockDtoList);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<String> deletePaperStock(@PathVariable Long id) {
        paperStockService.deleteById(id);
        return ResponseEntity.ok().build();    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<PaperStockDto> updatePaperStock(@PathVariable Long id, @RequestBody PaperStockDto paperStockDto) {
        PaperStockDto updatedPsDto = paperStockService.updatedPaperStock(id, paperStockDto);
        return ResponseEntity.ok(updatedPsDto);
    }
}

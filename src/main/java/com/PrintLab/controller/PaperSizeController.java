package com.PrintLab.controller;

import com.PrintLab.dto.PaperSizeDto;
import com.PrintLab.modal.PaperSize;
import com.PrintLab.modal.PressMachineSize;
import com.PrintLab.modal.UpingPaperSize;
import com.PrintLab.service.impl.PaperSizeServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<PaperSizeDto> createPaperSize(@RequestBody PaperSizeDto paperSizeDto) {
        try {
            return ResponseEntity.ok(paperSizeService.save(paperSizeDto));
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/{paper-size-id}/uping-paper-size")
    public ResponseEntity<UpingPaperSize> saveUpingPaperSize(@PathVariable("paper-size-id") Long paperSizeId, @RequestBody UpingPaperSize upingPaperSize) {
        UpingPaperSize saveUpingPaperSize = paperSizeService.addUpingPaperSize(paperSizeId, upingPaperSize);
        return ResponseEntity.ok(saveUpingPaperSize);
    }

    @GetMapping
    public ResponseEntity<List<PaperSizeDto>> getAllPaperSize() {
        List<PaperSizeDto> paperSizeDtoList = paperSizeService.getAll();
        return ResponseEntity.ok(paperSizeDtoList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PaperSizeDto> getPaperSizeById(@PathVariable Long id) {
        try {
            PaperSizeDto paperSizeDto = paperSizeService.findById(id);
            return ResponseEntity.ok(paperSizeDto);
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePaperSize(@PathVariable Long id) {
        paperSizeService.deleteById(id);
        return ResponseEntity.ok("Paper Size with ID " + id + " has been deleted.");
    }

    @DeleteMapping("/{id}/{upsId}")
    public ResponseEntity<String> deleteUpingPaperSize(@PathVariable Long id, @PathVariable Long upsId) {
        paperSizeService.deleteUpingPaperSizeById(id, upsId);
        return ResponseEntity.ok("Uping paper size with ID " + upsId + "has been Deleted");
    }

    @PutMapping("/{id}")
    public ResponseEntity<PaperSizeDto> updatePaperSize(@PathVariable Long id, @RequestBody PaperSizeDto paperSizeDto) {
        try {
            PaperSizeDto updatedPsDto = paperSizeService.updatePaperSize(id, paperSizeDto);
            return ResponseEntity.ok(updatedPsDto);
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}

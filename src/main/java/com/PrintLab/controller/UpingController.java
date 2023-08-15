package com.PrintLab.controller;

import com.PrintLab.dto.UpingDto;
import com.PrintLab.dto.VendorDto;
import com.PrintLab.service.UpingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/uping")
public class UpingController
{
    public final UpingService upingService;
    public UpingController(UpingService upingService) {
        this.upingService = upingService;
    }

    @PostMapping
    public ResponseEntity<UpingDto> createUping(@RequestBody UpingDto upingDto) {
        return ResponseEntity.ok(upingService.save(upingDto));
    }

    @GetMapping
    public ResponseEntity<List<UpingDto>> getAllUping() {
        List<UpingDto> upingDtoList = upingService.getAll();
        return ResponseEntity.ok(upingDtoList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UpingDto> getUpingById(@PathVariable Long id) {
        UpingDto upingDto = upingService.findById(id);
        return ResponseEntity.ok(upingDto);
    }

    @GetMapping("/{id}/paper-size")
    public ResponseEntity<List<UpingDto>> getUpingByPaperSizeId(@PathVariable Long id) {
        List<UpingDto> upingDtoList = upingService.getUpingByPaperSizeId(id);
        return ResponseEntity.ok(upingDtoList);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUping(@PathVariable Long id) {
        upingService.deleteById(id);
        return ResponseEntity.ok("Uping with ID " + id + " has been deleted.");
    }

    @DeleteMapping("/{id}/{uping-paper-size-id}")
    public ResponseEntity<String> deleteUpingPaperSize(@PathVariable Long id, @PathVariable(name = "uping-paper-size-id") Long upingPaperSizeId) {
        upingService.deleteUpingPaperSizeById(id, upingPaperSizeId);
        return ResponseEntity.ok("Uping Paper Size with ID " + upingPaperSizeId + "has been Deleted");
    }

    @PutMapping("/{id}")
    public ResponseEntity<UpingDto> updateUping(@PathVariable Long id, @RequestBody UpingDto upingDto) {
        UpingDto updatedUpingDto = upingService.updateUping(id, upingDto);
        return ResponseEntity.ok(updatedUpingDto);
    }
}

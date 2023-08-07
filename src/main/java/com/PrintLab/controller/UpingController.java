package com.PrintLab.controller;

import com.PrintLab.dto.UpingDto;
import com.PrintLab.modal.Uping;
import com.PrintLab.service.impl.UpingServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/uping")
public class UpingController
{
    public final UpingServiceImpl upingService;

    public UpingController(UpingServiceImpl upingService) {
        this.upingService = upingService;
    }

    @PostMapping
    public ResponseEntity<UpingDto> createUping(@RequestBody UpingDto upingDto) {
        try {
            return ResponseEntity.ok(upingService.save(upingDto));
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping
    public ResponseEntity<List<UpingDto>> getAllUping() {
        List<UpingDto> upingDtoList = upingService.getAll();
        return ResponseEntity.ok(upingDtoList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UpingDto> getUpingById(@PathVariable Long id) {
        try {
            UpingDto upingDto = upingService.findById(id);
            return ResponseEntity.ok(upingDto);
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUping(@PathVariable Long id) {
        upingService.deleteById(id);
        return ResponseEntity.ok("Uping with ID " + id + " has been deleted.");
    }

    @PutMapping("/{id}")
    public ResponseEntity<UpingDto> updateUping(@PathVariable Long id, @RequestBody Uping uping) {
        try {
            UpingDto updatedUpingDto = upingService.updateUping(id, uping);
            return ResponseEntity.ok(updatedUpingDto);
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}

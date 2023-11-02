package com.PrintLab.controller;

import com.PrintLab.dto.PaginationResponse;
import com.PrintLab.dto.UpingDto;
import com.PrintLab.service.UpingService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<UpingDto> createUping(@RequestBody UpingDto upingDto) {
        return ResponseEntity.ok(upingService.save(upingDto));
    }

    @GetMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<UpingDto>> getAllUping() {
        List<UpingDto> upingDtoList = upingService.getAll();
        return ResponseEntity.ok(upingDtoList);
    }

    @GetMapping("/page")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<PaginationResponse> getAllPaginatedUping(
            @RequestParam(value = "pageNumber", defaultValue = "0", required = false) Integer pageNumber,
            @RequestParam(value = "pageSize", defaultValue = "15", required = false) Integer pageSize
    ) {
        PaginationResponse paginationResponse = upingService.getAllPaginatedUping(pageNumber, pageSize);
        return ResponseEntity.ok(paginationResponse);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<UpingDto> getUpingById(@PathVariable Long id) {
        UpingDto upingDto = upingService.findById(id);
        return ResponseEntity.ok(upingDto);
    }

    @GetMapping("/{id}/paper-size")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<UpingDto>> getUpingByPaperSizeId(@PathVariable Long id) {
        List<UpingDto> upingDtoList = upingService.getUpingByPaperSizeId(id);
        return ResponseEntity.ok(upingDtoList);
    }

    @GetMapping("/product-sizes/{size}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<PaginationResponse> getUpingByProductSize(
            @PathVariable String size,
            @RequestParam(value = "pageNumber", defaultValue = "0", required = false) Integer pageNumber,
            @RequestParam(value = "pageSize", defaultValue = "15", required = false) Integer pageSize
    ) {
        PaginationResponse paginationResponse = upingService.searchByProductSize(size, pageNumber, pageSize);
        return ResponseEntity.ok(paginationResponse);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<String> deleteUping(@PathVariable Long id) {
        upingService.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/product-size/{size}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<UpingDto> getUpingByProductSize(@PathVariable String size) {
        UpingDto upingDto = upingService.findByProductSize(size);
        return ResponseEntity.ok(upingDto);
    }

    @DeleteMapping("/{id}/{uping-paper-size-id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<String> deleteUpingPaperSize(@PathVariable Long id, @PathVariable(name = "uping-paper-size-id") Long upingPaperSizeId) {
        upingService.deleteUpingPaperSizeById(id, upingPaperSizeId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<UpingDto> updateUping(@PathVariable Long id, @RequestBody UpingDto upingDto) {
        UpingDto updatedUpingDto = upingService.updateUping(id, upingDto);
        return ResponseEntity.ok(updatedUpingDto);
    }

    @PostMapping("/upload")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<UpingDto>> upload(@RequestParam("file") MultipartFile multipartFile) {
        List<UpingDto> updatedUpingDto = upingService.uploadFile(multipartFile);
        return ResponseEntity.ok(updatedUpingDto);
    }
}

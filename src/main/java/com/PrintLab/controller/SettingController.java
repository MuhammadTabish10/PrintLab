package com.PrintLab.controller;

import com.PrintLab.dto.PaperMarketRatesDto;
import com.PrintLab.dto.SettingDto;
import com.PrintLab.service.SettingService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/setting")
public class SettingController {
    private final SettingService settingService;

    public SettingController(SettingService settingService) {
        this.settingService = settingService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<SettingDto> createSetting(@RequestBody SettingDto settingDto) {
        return ResponseEntity.ok(settingService.save(settingDto));
    }

    @GetMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<SettingDto>> getAllSetting() {
        List<SettingDto> settingDtoList = settingService.getAll();
        return ResponseEntity.ok(settingDtoList);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<SettingDto> getSettingById(@PathVariable Long id) {
        SettingDto settingDto = settingService.findById(id);
        return ResponseEntity.ok(settingDto);
    }

    @GetMapping("/key/{key}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<SettingDto> getSettingByKey(@PathVariable String key) {
        SettingDto settingDto = settingService.findByKey(key);
        return ResponseEntity.ok(settingDto);
    }

    @GetMapping("/keys/{key}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<SettingDto>> getAllSettingByKey(@PathVariable String key) {
        List<SettingDto> settingDtoList = settingService.searchByKey(key);
        return ResponseEntity.ok(settingDtoList);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<String> deleteSetting(@PathVariable Long id) {
        settingService.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<SettingDto> updateSetting(@PathVariable Long id, @RequestBody SettingDto settingDto) {
        SettingDto updatedSettingDto = settingService.updateSetting(id, settingDto);
        return ResponseEntity.ok(updatedSettingDto);
    }
}

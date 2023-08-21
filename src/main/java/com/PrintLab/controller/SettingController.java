package com.PrintLab.controller;

import com.PrintLab.dto.SettingDto;
import com.PrintLab.service.SettingService;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<SettingDto> createSetting(@RequestBody SettingDto settingDto) {
        return ResponseEntity.ok(settingService.save(settingDto));
    }

    @GetMapping
    public ResponseEntity<List<SettingDto>> getAllSetting() {
        List<SettingDto> settingDtoList = settingService.getAll();
        return ResponseEntity.ok(settingDtoList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SettingDto> getSettingById(@PathVariable Long id) {
        SettingDto settingDto = settingService.findById(id);
        return ResponseEntity.ok(settingDto);
    }

    @GetMapping("/key/{key}")
    public ResponseEntity<SettingDto> getSettingByKey(@PathVariable String key) {
        SettingDto settingDto = settingService.findByKey(key);
        return ResponseEntity.ok(settingDto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteSetting(@PathVariable Long id) {
        settingService.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<SettingDto> updateSetting(@PathVariable Long id, @RequestBody SettingDto settingDto) {
        SettingDto updatedSettingDto = settingService.updateSetting(id, settingDto);
        return ResponseEntity.ok(updatedSettingDto);
    }
}

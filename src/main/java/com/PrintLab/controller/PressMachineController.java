package com.PrintLab.controller;

import com.PrintLab.dto.PressMachineDto;
import com.PrintLab.service.PressMachineService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/press-machine")
public class PressMachineController
{
    private final PressMachineService pressMachineService;
    public PressMachineController(PressMachineService pressMachineService) {
        this.pressMachineService = pressMachineService;
    }

    @PostMapping
    public ResponseEntity<PressMachineDto> createPressMachine(@RequestBody PressMachineDto pressMachineDto) {
        return ResponseEntity.ok(pressMachineService.save(pressMachineDto));
    }

    @GetMapping
    public ResponseEntity<List<PressMachineDto>> getPressMachine(){
        return ResponseEntity.ok(pressMachineService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PressMachineDto> getPressMachineById(@PathVariable Long id){
        PressMachineDto pressMachineDto = pressMachineService.findById(id);
        return ResponseEntity.ok(pressMachineDto);
    }

    @GetMapping("/{id}/paper-size")
    public ResponseEntity<List<PressMachineDto>> getPressMachineByPaperSizeId(@PathVariable Long id) {
        List<PressMachineDto> pressMachineDtoList = pressMachineService.getPressMachineByPaperSizeId(id);
        return ResponseEntity.ok(pressMachineDtoList);
    }

    @GetMapping("/name/{name}")
    public ResponseEntity<PressMachineDto> getPressMachineByName(@PathVariable String name) {
        PressMachineDto pressMachineDtoList = pressMachineService.findByName(name);
        return ResponseEntity.ok(pressMachineDtoList);
    }

    @GetMapping("/names/{name}")
    public ResponseEntity<List<PressMachineDto>> getPressMachinesByName(@PathVariable String name) {
        List<PressMachineDto> pressMachineDtoList = pressMachineService.searchByName(name);
        return ResponseEntity.ok(pressMachineDtoList);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePressMachine(@PathVariable Long id) {
        pressMachineService.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}/{pmId}")
    public ResponseEntity<String> deletePressMachineSize(@PathVariable Long id, @PathVariable Long pmId) {
        pressMachineService.deletePressMachineSizeById(id, pmId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<PressMachineDto> updatePressMachine(@PathVariable Long id, @RequestBody PressMachineDto pressMachineDto) {
        PressMachineDto updatedPmDto = pressMachineService.updatePressMachine(id, pressMachineDto);
        return ResponseEntity.ok(updatedPmDto);
    }
}

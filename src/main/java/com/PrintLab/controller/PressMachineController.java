package com.PrintLab.controller;

import com.PrintLab.dto.PressMachineDto;
import com.PrintLab.dto.ProductFieldDto;
import com.PrintLab.modal.PressMachine;
import com.PrintLab.modal.PressMachineSize;
import com.PrintLab.modal.ProductField;
import com.PrintLab.modal.ProductFieldValues;
import com.PrintLab.service.PressMachineService;
import org.springframework.http.HttpStatus;
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
        try {
            return ResponseEntity.ok(pressMachineService.save(pressMachineDto));
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/{press-machine-id}/press-machine-size")
    public ResponseEntity<PressMachineSize> savePressMachine(@PathVariable Long pressMachineId, @RequestBody PressMachineSize pressMachineSize) {
        PressMachineSize savePressMachineSize = pressMachineService.addPressMachineSize(pressMachineId, pressMachineSize);
        return ResponseEntity.ok(savePressMachineSize);
    }

    @GetMapping
    public ResponseEntity<List<PressMachineDto>> getPressMachine(){
        return ResponseEntity.ok(pressMachineService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PressMachineDto> getPressMachineById(@PathVariable Long id){
        try{
            PressMachineDto pressMachineDto = pressMachineService.findById(id);
            return ResponseEntity.ok(pressMachineDto);
        }
        catch(Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePressMachine(@PathVariable Long id) {
        pressMachineService.deleteById(id);
        return ResponseEntity.ok("Press Machine with ID " + id + " has been deleted.");
    }

    @DeleteMapping("/{id}/{pmId}")
    public ResponseEntity<String> deletePressMachineSize(@PathVariable Long id, @PathVariable Long pmId) {
        pressMachineService.deletePressMachineSizeById(id, pmId);
        return ResponseEntity.ok("Press Machine Size with ID " + pmId + "has been Deleted");
    }

    @PutMapping("/{id}")
    public ResponseEntity<PressMachineDto> updatePressMachine(@PathVariable Long id, @RequestBody PressMachine pressMachine) {
        try {
            PressMachineDto updatedPmDto = pressMachineService.updatePressMachine(id, pressMachine);
            return ResponseEntity.ok(updatedPmDto);
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}

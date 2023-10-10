package com.PrintLab.controller;

import com.PrintLab.dto.PaperMarketRequestBody;
import com.PrintLab.dto.PressMachineDto;
import com.PrintLab.service.PressMachineService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/press-machine")
public class PressMachineController
{
    private static final String PRESS = "press";
    private static final String VENDOR = "vendor";
    private final PressMachineService pressMachineService;
    public PressMachineController(PressMachineService pressMachineService) {
        this.pressMachineService = pressMachineService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<PressMachineDto> createPressMachine(@RequestBody PressMachineDto pressMachineDto) {
        return ResponseEntity.ok(pressMachineService.save(pressMachineDto));
    }

    @GetMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<PressMachineDto>> getPressMachine(){
        return ResponseEntity.ok(pressMachineService.getAll());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<PressMachineDto> getPressMachineById(@PathVariable Long id){
        PressMachineDto pressMachineDto = pressMachineService.findById(id);
        return ResponseEntity.ok(pressMachineDto);
    }

    @GetMapping("/{id}/paper-size")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<PressMachineDto>> getPressMachineByPaperSizeId(@PathVariable Long id) {
        List<PressMachineDto> pressMachineDtoList = pressMachineService.getPressMachineByPaperSizeId(id);
        return ResponseEntity.ok(pressMachineDtoList);
    }

    @GetMapping("/name/{name}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<PressMachineDto> getPressMachineByName(@PathVariable String name) {
        PressMachineDto pressMachineDtoList = pressMachineService.findByName(name);
        return ResponseEntity.ok(pressMachineDtoList);
    }

    @GetMapping("/names/{name}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<PressMachineDto>> getPressMachinesByName(@PathVariable String name) {
        List<PressMachineDto> pressMachineDtoList = pressMachineService.searchByName(name);
        return ResponseEntity.ok(pressMachineDtoList);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<String> deletePressMachine(@PathVariable Long id) {
        pressMachineService.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}/{pmId}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<String> deletePressMachineSize(@PathVariable Long id, @PathVariable Long pmId) {
        pressMachineService.deletePressMachineSizeById(id, pmId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<PressMachineDto> updatePressMachine(@PathVariable Long id, @RequestBody PressMachineDto pressMachineDto) {
        PressMachineDto updatedPmDto = pressMachineService.updatePressMachine(id, pressMachineDto);
        return ResponseEntity.ok(updatedPmDto);
    }

    @GetMapping("/product-rule")
    public ResponseEntity<?> getPressMachine(@RequestParam String action,
                                             @RequestParam (required = false) String press) {
        switch (action) {
            case PRESS:
                return ResponseEntity.ok(pressMachineService.findDistinctNames());
            case VENDOR:
                return ResponseEntity.ok(pressMachineService.findVendorByPressMachine(press));
            default:
                return ResponseEntity.badRequest().body("Invalid action parameter.");
        }
    }

}

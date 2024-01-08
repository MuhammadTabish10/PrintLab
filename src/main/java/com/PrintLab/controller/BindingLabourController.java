package com.PrintLab.controller;

import com.PrintLab.dto.BindingLabourDto;
import com.PrintLab.model.BindingLabour;
import com.PrintLab.service.BindingLabourService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class BindingLabourController {

    @Autowired
    BindingLabourService bindingLabourService;

    @PostMapping("/binding-labour")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<BindingLabourDto> saveLabour(@RequestBody BindingLabourDto bindingLabourDto) {
        BindingLabourDto savedLabour = bindingLabourService.save(bindingLabourDto);
        return ResponseEntity.ok(savedLabour);
    }
    @GetMapping("/binding-labour")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<BindingLabourDto>> findAll(){
        List<BindingLabourDto> bindingLabourDtoList = bindingLabourService.findAll();
        return ResponseEntity.ok(bindingLabourDtoList);
    }
    @GetMapping("/binding-labour/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<BindingLabourDto> getLabourById(@PathVariable Long id) {
        BindingLabourDto bindingLabourDto = bindingLabourService.findById(id);
        return ResponseEntity.ok(bindingLabourDto);
    }

    @GetMapping("/binding-labours/{name}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<BindingLabourDto>> getAllLaboursByName(@PathVariable String name) {
        List<BindingLabourDto> bindingLabourDtoList = bindingLabourService.searchByName(name);
        return ResponseEntity.ok(bindingLabourDtoList);
    }

    @DeleteMapping("/binding-labour/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<String> deleteLabour(@PathVariable Long id) {
        bindingLabourService.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/binding-labour/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<BindingLabourDto> updateLabour(@PathVariable Long id, @RequestBody BindingLabour bindingLabour) {
        BindingLabourDto updatedLabour = bindingLabourService.updateLabour(id, bindingLabour);
        return ResponseEntity.ok(updatedLabour);
    }
}

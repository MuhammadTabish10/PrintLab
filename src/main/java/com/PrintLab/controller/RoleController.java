package com.PrintLab.controller;

import com.PrintLab.dto.RoleDto;
import com.PrintLab.dto.SettingDto;
import com.PrintLab.service.RoleService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class RoleController {

    private final RoleService roleService;

    public RoleController(RoleService roleService) {
        this.roleService = roleService;
    }

    @GetMapping("/role")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<RoleDto>> getAllRole() {
        List<RoleDto> roleDtoList = roleService.getAll();
        return ResponseEntity.ok(roleDtoList);
    }

    @GetMapping("/role/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<RoleDto> getRoleById(@PathVariable Long id) {
        RoleDto roleDto = roleService.findById(id);
        return ResponseEntity.ok(roleDto);
    }

    @PutMapping("/role/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<RoleDto> updateRole(@PathVariable Long id, @RequestBody RoleDto roleDto) {
        RoleDto updatedRoleDto = roleService.updateRole(id, roleDto);
        return ResponseEntity.ok(updatedRoleDto);
    }
}

package com.PrintLab.controller;

import com.PrintLab.dto.UserDto;
import com.PrintLab.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class UserController {
    private  final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/user")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<UserDto> userDtoList = userService.getAll();
        return ResponseEntity.ok(userDtoList);
    }

    @GetMapping("/user/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long id) {
        UserDto userDto = userService.findById(id);
        return ResponseEntity.ok(userDto);
    }

    @GetMapping("/user/role/{role}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<UserDto>> getUserByRole(@PathVariable String role) {
        List<UserDto> userDto = userService.getUsersByRole(role);
        return ResponseEntity.ok(userDto);
    }

    @PutMapping("/user/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_PRODUCTION', 'ROLE_DESIGNER', 'ROLE_PLATE_SETTER')")
    public ResponseEntity<UserDto> updateUser(@PathVariable Long id, @RequestBody UserDto userDto) {
        UserDto updatedUserDto = userService.updateUser(id, userDto);
        return ResponseEntity.ok(updatedUserDto);
    }

    @DeleteMapping("/user/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        userService.deleteById(id);
        return ResponseEntity.ok().build();
    }


}   

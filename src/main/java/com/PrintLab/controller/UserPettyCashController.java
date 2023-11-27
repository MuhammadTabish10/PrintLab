package com.PrintLab.controller;

import com.PrintLab.dto.UserPettyCashDto;
import com.PrintLab.service.UserPettyCashService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class UserPettyCashController {
    private final UserPettyCashService userPettyCashService;

    public UserPettyCashController(UserPettyCashService userPettyCashService) {
        this.userPettyCashService = userPettyCashService;
    }

    @PostMapping("/user-petty-cash")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<UserPettyCashDto> createUserPettyCash(@RequestBody UserPettyCashDto userPettyCashDto) {
        return ResponseEntity.ok(userPettyCashService.save(userPettyCashDto));
    }

    @GetMapping("/user-petty-cash")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_PRODUCTION', 'ROLE_DESIGNER', 'ROLE_PLATE_SETTER')")
    public ResponseEntity<List<UserPettyCashDto>> getAllUserPettyCash() {
        List<UserPettyCashDto> userPettyCashDtoList = userPettyCashService.getAll();
        return ResponseEntity.ok(userPettyCashDtoList);
    }

    @GetMapping("/user-petty-cash/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_PRODUCTION', 'ROLE_DESIGNER', 'ROLE_PLATE_SETTER')")
    public ResponseEntity<UserPettyCashDto> getUserPettyCashById(@PathVariable Long id) {
        UserPettyCashDto userPettyCashDto = userPettyCashService.findById(id);
        return ResponseEntity.ok(userPettyCashDto);
    }

    @DeleteMapping("/user-petty-cash/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<String> deleteUserPettyCash(@PathVariable Long id) {
        userPettyCashService.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/user-petty-cash/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<UserPettyCashDto> updateUserPettyCash(@PathVariable Long id, @RequestBody UserPettyCashDto userPettyCashDto) {
        UserPettyCashDto updatedUserPettyCashDto = userPettyCashService.update(id, userPettyCashDto);
        return ResponseEntity.ok(updatedUserPettyCashDto);
    }
}

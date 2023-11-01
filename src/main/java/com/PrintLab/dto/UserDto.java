package com.PrintLab.dto;

import com.PrintLab.model.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class UserDto {
    private Long id;
    private LocalDateTime createdAt;
    private String name;
    private String password;
    private String phone;
    private String cnic;
    private Boolean status;
    private Set<Role> roles = new HashSet<>();
}

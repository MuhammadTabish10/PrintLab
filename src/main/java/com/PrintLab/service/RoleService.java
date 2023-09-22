package com.PrintLab.service;


import com.PrintLab.dto.RoleDto;

import java.util.List;

public interface RoleService {
    List<RoleDto> getAll();
    RoleDto findById(Long id);
    RoleDto updateRole(Long id, RoleDto roleDto);

}

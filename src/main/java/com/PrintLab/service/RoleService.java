package com.PrintLab.service;


import com.PrintLab.dto.RoleDto;
import com.PrintLab.model.Role;

import java.util.List;

public interface RoleService {

    RoleDto addRole(RoleDto roleDto);
    List<RoleDto> getAll();
    RoleDto findById(Long id);
    RoleDto updateRole(Long id, RoleDto roleDto);

}

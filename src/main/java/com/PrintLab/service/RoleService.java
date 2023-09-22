package com.PrintLab.service;


import com.PrintLab.dto.RoleDto;
import com.PrintLab.dto.SettingDto;

import java.util.List;

public interface RoleService {
    List<RoleDto> getAll();
    RoleDto findById(Long id);
    RoleDto updateRole(Long id, RoleDto roleDto);

}

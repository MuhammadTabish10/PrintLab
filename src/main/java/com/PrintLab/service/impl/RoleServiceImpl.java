package com.PrintLab.service.impl;

import com.PrintLab.dto.RoleDto;
import com.PrintLab.exception.RecordNotFoundException;
import com.PrintLab.model.Permission;
import com.PrintLab.model.Role;
import com.PrintLab.repository.RoleRepository;
import com.PrintLab.service.RoleService;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.*;

@Service
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;

    public RoleServiceImpl(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Override
    public List<RoleDto> getAll() {
        List<Role> roleList = roleRepository.findAll();
        List<RoleDto> roleDtoList = new ArrayList<>();

        for (Role role : roleList) {
            RoleDto roleDto = toDto(role);
            roleDtoList.add(roleDto);
        }
        return roleDtoList;
    }

    @Override
    public RoleDto findById(Long id) {
        Optional<Role> optionalRole = roleRepository.findById(id);

        if (optionalRole.isPresent()) {
            Role role = optionalRole.get();
            return toDto(role);
        } else {
            throw new RecordNotFoundException(String.format("Role not found for id => %d", id));
        }
    }

    @Transactional
    @Override
    public RoleDto updateRole(Long id, RoleDto roleDto) {
        Role role = toEntity(roleDto);
        Optional<Role> optionalRole = roleRepository.findById(id);

        if (optionalRole.isPresent()) {
            Role existingRole = optionalRole.get();
            existingRole.setName(role.getName());

            Set<Permission> existingPerValues = existingRole.getPermissions();
            Set<Permission> newPerValues = roleDto.getPermissions();

            // Remove permissions that are present in existingPerValues but not in newPerValues
            existingPerValues.removeIf(existingPermission -> !newPerValues.contains(existingPermission));

            // Add permissions that are present in newPerValues but not in existingPerValues
            newPerValues.removeAll(existingPerValues);
            existingPerValues.addAll(newPerValues);

            Role updatedRole = roleRepository.save(existingRole);
            return toDto(updatedRole);
        } else {
            throw new RecordNotFoundException(String.format("Role not found for id => %d", id));
        }
    }


    public RoleDto toDto(Role role) {
        return RoleDto.builder()
                .id(role.getId())
                .name(role.getName())
                .permissions(role.getPermissions())
                .build();
    }

    public Role toEntity(RoleDto roleDto) {
        return Role.builder()
                .id(roleDto.getId())
                .name(roleDto.getName())
                .permissions(roleDto.getPermissions())
                .build();
    }
}

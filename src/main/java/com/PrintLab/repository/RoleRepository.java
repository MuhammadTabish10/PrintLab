package com.PrintLab.repository;

import com.PrintLab.modal.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    Role getRoleByName(String roleAdmin);
}

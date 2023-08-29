package com.PrintLab.service.impl;

import com.PrintLab.dto.LoginCredentials;
import com.PrintLab.modal.Role;
import com.PrintLab.modal.User;
import com.PrintLab.repository.RoleRepository;
import com.PrintLab.repository.UserRepository;
import com.PrintLab.service.UserService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Set;

@Service
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;

    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final RoleRepository roleRepository;

    public UserServiceImpl(UserRepository userRepository, BCryptPasswordEncoder bCryptPasswordEncoder, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
        this.roleRepository = roleRepository;
    }


    @Override
    public User registerUser(User user) {
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));

        // Fetch role entities from the database by their IDs
        Role adminRole = roleRepository.findById(1L).orElse(null);
        Role userRole = roleRepository.findById(2L).orElse(null);

        if (adminRole != null && userRole != null) {
            user.getRoles().add(adminRole);
            user.getRoles().add(userRole);
        }


        userRepository.save(user);
        return user;
    }
}

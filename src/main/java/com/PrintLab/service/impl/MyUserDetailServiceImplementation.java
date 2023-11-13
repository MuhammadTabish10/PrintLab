package com.PrintLab.service.impl;

import com.PrintLab.model.CustomUserDetail;
import com.PrintLab.model.User;
import com.PrintLab.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class MyUserDetailServiceImplementation implements UserDetailsService {

    @Autowired
    UserRepository userRepository;

    @Override
    public CustomUserDetail loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmailAndStatusIsTrue(email);

        if(user == null) {
            throw new UsernameNotFoundException("User not found with email: " + email);
        }
        return new CustomUserDetail(user);
    }
}

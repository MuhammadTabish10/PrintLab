package com.PrintLab.utils;

import com.PrintLab.exception.RecordNotFoundException;
import com.PrintLab.model.CustomUserDetail;
import com.PrintLab.model.User;
import com.PrintLab.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class HelperUtils {
    private final UserRepository userRepository;

    public HelperUtils(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof CustomUserDetail) {
            String email = ((CustomUserDetail) principal).getEmail();
            return userRepository.findByEmailAndStatusIsTrue(email);
        } else {
            throw new RecordNotFoundException("User not Found");
        }
    }

}

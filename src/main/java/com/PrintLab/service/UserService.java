package com.PrintLab.service;

import com.PrintLab.modal.User;
import org.springframework.stereotype.Service;

@Service
public interface UserService {
    User registerUser(User user);
}

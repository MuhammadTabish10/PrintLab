package com.PrintLab.service;

import com.PrintLab.dto.UserDto;
import com.PrintLab.model.User;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface UserService {
    User registerUser(User user);
    List<UserDto> getAll();
    UserDto findById(Long id);
    UserDto updateUser(Long id, UserDto userDto);
    void deleteById(Long id);
}

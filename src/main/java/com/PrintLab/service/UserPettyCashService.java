package com.PrintLab.service;

import com.PrintLab.dto.UserPettyCashDto;

import java.util.List;

public interface UserPettyCashService {
    UserPettyCashDto save(UserPettyCashDto userPettyCashDto);
    List<UserPettyCashDto> getAll();
    UserPettyCashDto findById(Long id);
    void deleteById(Long id);
    UserPettyCashDto update(Long id, UserPettyCashDto userPettyCashDto);
}

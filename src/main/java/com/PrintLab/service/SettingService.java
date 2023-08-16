package com.PrintLab.service;

import com.PrintLab.dto.ProductProcessDto;
import com.PrintLab.dto.SettingDto;

import java.util.List;

public interface SettingService
{
    SettingDto save(SettingDto settingDto);
    List<SettingDto> getAll();
    SettingDto findById(Long id);
    List<SettingDto> findByKey(String key);
    String deleteById(Long id);
    SettingDto updateSetting(Long id, SettingDto settingDto);
}

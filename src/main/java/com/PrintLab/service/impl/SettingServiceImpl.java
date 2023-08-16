package com.PrintLab.service.impl;

import com.PrintLab.dto.ProductFieldDto;
import com.PrintLab.dto.SettingDto;
import com.PrintLab.exception.RecordNotFoundException;
import com.PrintLab.modal.ProductField;
import com.PrintLab.modal.Setting;
import com.PrintLab.repository.SettingRepository;
import com.PrintLab.service.SettingService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class SettingServiceImpl implements SettingService
{
    private final SettingRepository settingRepository;

    public SettingServiceImpl(SettingRepository settingRepository) {
        this.settingRepository = settingRepository;
    }

    @Override
    public SettingDto save(SettingDto settingDto) {
        Setting setting = settingRepository.save(toEntity(settingDto));
        return toDto(setting);
    }

    @Override
    public List<SettingDto> getAll() {
        List<Setting> settingList = settingRepository.findAll();
        List<SettingDto> settingDtoList = new ArrayList<>();

        for (Setting setting : settingList) {
            SettingDto settingDto = toDto(setting);
            settingDtoList.add(settingDto);
        }
        return settingDtoList;
    }

    @Override
    public SettingDto findById(Long id){
        Optional<Setting> optionalSetting = settingRepository.findById(id);

        if (optionalSetting.isPresent()) {
            Setting setting = optionalSetting.get();
            return toDto(setting);
        } else {
            throw new RecordNotFoundException(String.format("Setting not found for id => %d", id));
        }
    }

    @Override
    public List<SettingDto> findByKey(String key) {
        Optional<List<Setting>> settingList = Optional.ofNullable(settingRepository.findByKey(key));
        List<SettingDto> settingDtoList = new ArrayList<>();

        if(settingList.isPresent()){
            for (Setting setting : settingList.get()) {
                SettingDto settingDto = toDto(setting);
                settingDtoList.add(settingDto);
            }
            return settingDtoList;
        }
        else {
            throw new RecordNotFoundException(String.format("Setting not found at => %s", key));
        }
    }

    @Override
    public String deleteById(Long id) {
        Optional<Setting> optionalSetting = settingRepository.findById(id);

        if (optionalSetting.isPresent()) {
            Setting setting = optionalSetting.get();
            settingRepository.deleteById(id);
        } else {
            throw new RecordNotFoundException(String.format("Setting not found for id => %d", id));
        }
        return null;
    }

    @Override
    public SettingDto updateSetting(Long id, SettingDto settingDto) {
        Optional<Setting> optionalSetting = settingRepository.findById(id);
        if (optionalSetting.isPresent()) {
            Setting existingSetting = optionalSetting.get();
            existingSetting.setKey(settingDto.getKey());
            existingSetting.setValue(settingDto.getValue());

            Setting updatedSetting = settingRepository.save(existingSetting);
            return toDto(updatedSetting);
        } else {
            throw new RecordNotFoundException(String.format("Setting not found for id => %d", id));
        }
    }

    public SettingDto toDto(Setting setting) {
        return SettingDto.builder()
                .id(setting.getId())
                .key(setting.getKey())
                .value(setting.getValue())
                .build();
    }

    public Setting toEntity(SettingDto settingDto) {
        return Setting.builder()
                .id(settingDto.getId())
                .key(settingDto.getKey())
                .value(settingDto.getValue())
                .build();
    }
}

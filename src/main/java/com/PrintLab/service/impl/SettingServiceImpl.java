package com.PrintLab.service.impl;

import com.PrintLab.dto.SettingDto;
import com.PrintLab.exception.RecordNotFoundException;
import com.PrintLab.model.Setting;
import com.PrintLab.repository.SettingRepository;
import com.PrintLab.service.SettingService;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
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
    @Transactional
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
    public SettingDto findByKey(String key) {
        Optional<Setting> settingOptional = Optional.ofNullable(settingRepository.findByKey(key));

        if(settingOptional.isPresent()){
            Setting setting = settingOptional.get();
            return toDto(setting);
        }
        else {
            throw new RecordNotFoundException(String.format("Setting not found at => %s", key));
        }
    }

    @Override
    public List<SettingDto> searchByKey(String key) {
        List<Setting> settingList = settingRepository.findSettingsByKey(key);
        List<SettingDto> settingDtoList = new ArrayList<>();

        for (Setting setting : settingList) {
            SettingDto settingDto = toDto(setting);
            settingDtoList.add(settingDto);
        }
        return settingDtoList;
    }

    @Override
    @Transactional
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
    @Transactional
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

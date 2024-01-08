package com.PrintLab.service.impl;

import com.PrintLab.dto.BindingLabourDto;
import com.PrintLab.exception.RecordNotFoundException;
import com.PrintLab.model.BindingLabour;
import com.PrintLab.model.User;
import com.PrintLab.repository.BindingLabourRepository;
import com.PrintLab.service.BindingLabourService;
import com.PrintLab.utils.HelperUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BindingLabourImpl implements BindingLabourService {

    private final BindingLabourRepository bindingLabourRepository;
    private final HelperUtils helperUtils;

    @Autowired
    public BindingLabourImpl(BindingLabourRepository bindingLabourRepository,HelperUtils helperUtils) {
        this.bindingLabourRepository = bindingLabourRepository;
        this.helperUtils = helperUtils;
    }

    @Override
    public BindingLabourDto save(BindingLabourDto bindingLabourDto) {
        User user = helperUtils.getCurrentUser();
        LocalDateTime timeStampUtc = LocalDateTime.now(ZoneOffset.UTC);
        bindingLabourDto.setTimeStamp(timeStampUtc);
        bindingLabourDto.setCreatedBy(user.getName());
        bindingLabourDto.setStatus(true);
        BindingLabour saved = bindingLabourRepository.save(toEntity(bindingLabourDto));
        return toDto(saved);
    }

    @Override
    public List<BindingLabourDto> findAll() {
        return bindingLabourRepository.findByStatus(true)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }


    @Override
    public BindingLabourDto findById(Long id) {
        return bindingLabourRepository.findById(id)
                .map(this::toDto)
                .orElseThrow(() -> new RecordNotFoundException(String.format("Vendor not found on id => %d", id)));
    }


    @Override
    public List<BindingLabourDto> searchByName(String name) {
        List<BindingLabour> bindingLabourList = bindingLabourRepository.findLabourByNameLike("%" + name + "%");

        return bindingLabourList.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }


    @Override
    public void deleteById(Long id) {
        Optional<BindingLabour> existingLabour = bindingLabourRepository.findById(id);

        if (existingLabour.isPresent()) {
            BindingLabour labour = existingLabour.get();
            labour.setStatus(false);
            bindingLabourRepository.save(labour);
        } else {
            throw new RecordNotFoundException(String.format("Vendor not found on id => %d", id));
        }
    }


    @Override
    public BindingLabourDto updateLabour(Long id, BindingLabour bindingLabour) {
        Optional<BindingLabour> optionalBindingLabour = bindingLabourRepository.findById(id);
        if (optionalBindingLabour.isPresent()) {
            BindingLabour existedLabour = optionalBindingLabour.get();
            existedLabour.setTimeStamp(LocalDateTime.now(ZoneOffset.UTC));
            existedLabour.setName(bindingLabour.getName());
            existedLabour.setType(bindingLabour.getType());
            existedLabour.setCategory(bindingLabour.getCategory());
            existedLabour.setSize(bindingLabour.getSize());
            existedLabour.setRate(bindingLabour.getRate());
            existedLabour.setStatus(true);
            BindingLabour updatedLabour = bindingLabourRepository.save(existedLabour);
            return toDto(updatedLabour);
        } else {
            throw new RecordNotFoundException(String.format("Vendor not found on id => %d", id));
        }
    }

    public BindingLabour toEntity(BindingLabourDto bindingLabourDto) {
        return BindingLabour.builder()
                .id(bindingLabourDto.getId())
                .timeStamp(bindingLabourDto.getTimeStamp())
                .name(bindingLabourDto.getName())
                .createdBy(bindingLabourDto.getCreatedBy())
                .type(bindingLabourDto.getType())
                .category(bindingLabourDto.getCategory())
                .size(bindingLabourDto.getSize())
                .rate(bindingLabourDto.getRate())
                .status(bindingLabourDto.isStatus())
                .build();
    }

    public BindingLabourDto toDto(BindingLabour bindingLabour) {
        return BindingLabourDto.builder()
                .id(bindingLabour.getId())
                .timeStamp(bindingLabour.getTimeStamp())
                .name(bindingLabour.getName())
                .createdBy(bindingLabour.getCreatedBy())
                .type(bindingLabour.getType())
                .category(bindingLabour.getCategory())
                .size(bindingLabour.getSize())
                .rate(bindingLabour.getRate())
                .status(bindingLabour.isStatus())
                .build();
    }

    private String getLoggedInUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            return authentication.getName();
        }
        return "UnknownUser";
    }
}


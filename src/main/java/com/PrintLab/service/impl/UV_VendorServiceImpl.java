package com.PrintLab.service.impl;

import com.PrintLab.dto.UV_VendorDto;
import com.PrintLab.exception.RecordNotFoundException;
import com.PrintLab.model.UV_Vendor;
import com.PrintLab.model.User;
import com.PrintLab.repository.UV_VendorRepository;
import com.PrintLab.service.UV_VendorService;
import com.PrintLab.utils.HelperUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
@Service
public class UV_VendorServiceImpl implements UV_VendorService {

    private final UV_VendorRepository uvVendorRepository;
    private final HelperUtils helperUtils;

    @Autowired
    public UV_VendorServiceImpl(UV_VendorRepository uvVendorRepository, HelperUtils helperUtils) {
        this.uvVendorRepository = uvVendorRepository;
        this.helperUtils = helperUtils;
    }
    @Override
    public UV_VendorDto save(UV_VendorDto uvVendorDto) {
        User user = helperUtils.getCurrentUser();
        LocalDateTime timeStampUtc = LocalDateTime.now(ZoneOffset.UTC);
        uvVendorDto.setTimeStamp(timeStampUtc);
        uvVendorDto.setCreatedBy(user.getName());
        uvVendorDto.setStatus(true);
        UV_Vendor saved = uvVendorRepository.save(toEntity(uvVendorDto));
        return toDto(saved);
    }

    @Override
    public List<UV_VendorDto> findAll() {
        return uvVendorRepository.findByStatus(true)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public UV_VendorDto findById(Long id) {
        return uvVendorRepository.findById(id)
                .map(this::toDto)
                .orElseThrow(() -> new RecordNotFoundException(String.format("Vendor not found on id => %d", id)));
    }

    @Override
    public List<UV_VendorDto> searchByName(String name) {
        List<UV_Vendor> uvVendorList = uvVendorRepository.findVendorByNameLikeAndStatusIsTrue("%" + name + "%");

        return uvVendorList.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteById(Long id) {
        Optional<UV_Vendor> existingVendor = uvVendorRepository.findById(id);

        if (existingVendor.isPresent()) {
            UV_Vendor vendor = existingVendor.get();
            vendor.setStatus(false);
            uvVendorRepository.save(vendor);
        } else {
            throw new RecordNotFoundException(String.format("Vendor not found on id => %d", id));
        }
    }

    @Override
    public UV_VendorDto updateVendor(Long id, UV_Vendor uvVendor) {
        Optional<UV_Vendor> optionalUvVendor = uvVendorRepository.findById(id);
        if (optionalUvVendor.isPresent()) {
            UV_Vendor existedVendor = optionalUvVendor.get();
            existedVendor.setTimeStamp(LocalDateTime.now(ZoneOffset.UTC));
            existedVendor.setName(uvVendor.getName());
            existedVendor.setType(uvVendor.getType());
            existedVendor.setRate(uvVendor.getRate());
            existedVendor.setStatus(true);
            UV_Vendor updatedVendor = uvVendorRepository.save(existedVendor);
            return toDto(updatedVendor);
        } else {
            throw new RecordNotFoundException(String.format("Vendor not found on id => %d", id));
        }
    }

    public UV_Vendor toEntity(UV_VendorDto uvVendorDto) {
        return UV_Vendor.builder()
                .id(uvVendorDto.getId())
                .timeStamp(uvVendorDto.getTimeStamp())
                .name(uvVendorDto.getName())
                .createdBy(uvVendorDto.getCreatedBy())
                .type(uvVendorDto.getType())
                .rate(uvVendorDto.getRate())
                .status(uvVendorDto.isStatus())
                .build();
    }

    public UV_VendorDto toDto(UV_Vendor uvVendor) {
        return UV_VendorDto.builder()
                .id(uvVendor.getId())
                .timeStamp(uvVendor.getTimeStamp())
                .name(uvVendor.getName())
                .createdBy(uvVendor.getCreatedBy())
                .type(uvVendor.getType())
                .rate(uvVendor.getRate())
                .status(uvVendor.isStatus())
                .build();
    }
}

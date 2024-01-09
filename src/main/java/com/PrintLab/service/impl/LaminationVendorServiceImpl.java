package com.PrintLab.service.impl;

import com.PrintLab.dto.LaminationVendorDto;
import com.PrintLab.exception.RecordNotFoundException;
import com.PrintLab.model.LaminationVendor;
import com.PrintLab.model.User;
import com.PrintLab.repository.LaminationVendorRepository;
import com.PrintLab.service.LaminationVendorService;
import com.PrintLab.utils.HelperUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
@Service
public class LaminationVendorServiceImpl implements LaminationVendorService {

    private final LaminationVendorRepository laminationVendorRepository;
    private final HelperUtils helperUtils;

    @Autowired
    public LaminationVendorServiceImpl(LaminationVendorRepository laminationVendorRepository, HelperUtils helperUtils) {
        this.laminationVendorRepository = laminationVendorRepository;
        this.helperUtils = helperUtils;
    }

    @Override
    public LaminationVendorDto save(LaminationVendorDto laminationVendorDto) {
        User user = helperUtils.getCurrentUser();
        LocalDateTime timeStampUtc = LocalDateTime.now(ZoneOffset.UTC);
        laminationVendorDto.setTimeStamp(timeStampUtc);
        laminationVendorDto.setCreatedBy(user.getName());
        laminationVendorDto.setStatus(true);
        LaminationVendor saved = laminationVendorRepository.save(toEntity(laminationVendorDto));
        return toDto(saved);
    }

    @Override
    public List<LaminationVendorDto> findAll() {
        return laminationVendorRepository.findByStatus(true)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public LaminationVendorDto findById(Long id) {
        return laminationVendorRepository.findById(id)
                .map(this::toDto)
                .orElseThrow(() -> new RecordNotFoundException(String.format("Vendor not found on id => %d", id)));
    }

    @Override
    public List<LaminationVendorDto> searchByName(String name) {
        List<LaminationVendor> laminationVendorList = laminationVendorRepository.findVendorByNameLikeAndStatusIsTrue("%" + name + "%");

        return laminationVendorList.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteById(Long id) {
        Optional<LaminationVendor> existingVendor = laminationVendorRepository.findById(id);

        if (existingVendor.isPresent()) {
            LaminationVendor vendor = existingVendor.get();
            vendor.setStatus(false);
            laminationVendorRepository.save(vendor);
        } else {
            throw new RecordNotFoundException(String.format("Vendor not found on id => %d", id));
        }
    }

    @Override
    public LaminationVendorDto updateVendor(Long id, LaminationVendor laminationVendor) {
        Optional<LaminationVendor> optionalLaminationVendor = laminationVendorRepository.findById(id);
        if (optionalLaminationVendor.isPresent()) {
            LaminationVendor existedVendor = optionalLaminationVendor.get();
            existedVendor.setTimeStamp(LocalDateTime.now(ZoneOffset.UTC));
            existedVendor.setName(laminationVendor.getName());
            existedVendor.setProcess(laminationVendor.getProcess());
            existedVendor.setType(laminationVendor.getType());
            existedVendor.setRate(laminationVendor.getRate());
            existedVendor.setStatus(true);
            LaminationVendor updatedVendor = laminationVendorRepository.save(existedVendor);
            return toDto(updatedVendor);
        } else {
            throw new RecordNotFoundException(String.format("Vendor not found on id => %d", id));
        }
    }

    public LaminationVendor toEntity(LaminationVendorDto laminationVendorDto) {
        return LaminationVendor.builder()
                .id(laminationVendorDto.getId())
                .timeStamp(laminationVendorDto.getTimeStamp())
                .name(laminationVendorDto.getName())
                .createdBy(laminationVendorDto.getCreatedBy())
                .process(laminationVendorDto.getProcess())
                .type(laminationVendorDto.getType())
                .rate(laminationVendorDto.getRate())
                .status(laminationVendorDto.isStatus())
                .build();
    }

    public LaminationVendorDto toDto(LaminationVendor laminationVendor) {
        return LaminationVendorDto.builder()
                .id(laminationVendor.getId())
                .timeStamp(laminationVendor.getTimeStamp())
                .name(laminationVendor.getName())
                .createdBy(laminationVendor.getCreatedBy())
                .process(laminationVendor.getProcess())
                .type(laminationVendor.getType())
                .rate(laminationVendor.getRate())
                .status(laminationVendor.isStatus())
                .build();
    }
}

package com.PrintLab.service.impl;

import com.PrintLab.dto.UpingDto;
import com.PrintLab.modal.Uping;
import com.PrintLab.repository.UpingRepository;
import com.PrintLab.service.UpingService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UpingServiceImpl implements UpingService
{
    private final UpingRepository upingRepository;

    public UpingServiceImpl(UpingRepository upingRepository) {
        this.upingRepository = upingRepository;
    }


    @Override
    public UpingDto save(UpingDto upingDto) {
        Uping uping = upingRepository.save(toEntity(upingDto));
        return toDto(uping);
    }

    @Override
    public List<UpingDto> getAll() {
        List<Uping> upingList = upingRepository.findAll();
        List<UpingDto> upingDtoList = new ArrayList<>();

        for (Uping uping : upingList) {
            UpingDto upingDto = toDto(uping);
            upingDtoList.add(upingDto);
        }
        return upingDtoList;
    }

    @Override
    public UpingDto findById(Long id) throws Exception {
        Optional<Uping> optionalUping = upingRepository.findById(id);

        if(optionalUping.isPresent()) {
            Uping uping = optionalUping.get();
            return toDto(uping);
        }
        else {
            throw new Exception("Uping not found with ID " + id);
        }
    }

    @Override
    public String deleteById(Long id) {
        Optional<Uping> optionalUping = upingRepository.findById(id);

        if(optionalUping.isPresent()) {
            Uping uping = optionalUping.get();
            upingRepository.deleteById(id);
        }
        else{
            throw new IllegalArgumentException("Uping not found with ID " + id);
        }
        return null;
    }

    @Override
    public UpingDto updateUping(Long id, Uping uping) {
        Optional<Uping> optionalUping = upingRepository.findById(id);
        if(optionalUping.isPresent()){
            Uping existingUping = optionalUping.get();
            existingUping.setProductSize(uping.getProductSize());

            Uping updatedUping = upingRepository.save(existingUping);
            return toDto(updatedUping);
        }
        else {
            throw new IllegalArgumentException("Uping not found with ID"+ id);
        }
    }

    public UpingDto toDto(Uping uping) {
        return UpingDto.builder()
                .id(uping.getId())
                .productSize(uping.getProductSize())
                .build();
    }

    public Uping toEntity(UpingDto upingDto) {
        return Uping.builder()
                .id(upingDto.getId())
                .productSize(upingDto.getProductSize())
                .build();
    }
}

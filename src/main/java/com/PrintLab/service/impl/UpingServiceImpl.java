package com.PrintLab.service.impl;

import com.PrintLab.dto.UpingDto;
import com.PrintLab.dto.UpingPaperSizeDto;
import com.PrintLab.exception.RecordNotFoundException;
import com.PrintLab.modal.*;
import com.PrintLab.repository.PaperSizeRepository;
import com.PrintLab.repository.UpingPaperSizeRepository;
import com.PrintLab.repository.UpingRepository;
import com.PrintLab.service.UpingService;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UpingServiceImpl implements UpingService {
    private final UpingRepository upingRepository;
    private final UpingPaperSizeRepository upingPaperSizeRepository;
    private final PaperSizeRepository paperSizeRepository;

    public UpingServiceImpl(UpingRepository upingRepository, UpingPaperSizeRepository upingPaperSizeRepository, PaperSizeRepository paperSizeRepository) {
        this.upingRepository = upingRepository;
        this.upingPaperSizeRepository = upingPaperSizeRepository;
        this.paperSizeRepository = paperSizeRepository;
    }


    @Transactional
    @Override
    public UpingDto save(UpingDto upingDto) {
        Uping uping = toEntity(upingDto);
        Uping createdUping = upingRepository.save(uping);

        List<UpingPaperSize> upingPaperSize = uping.getUpingPaperSize();
        if (upingPaperSize != null && !upingPaperSize.isEmpty()) {
            for (UpingPaperSize ups : upingPaperSize) {
                ups.setUping(createdUping);
                ups.setPaperSize(paperSizeRepository.findById(ups.getPaperSize().getId())
                        .orElseThrow(() -> new RecordNotFoundException(String.format("Paper Size not found for id => %d", ups.getPaperSize().getId()))));
                upingPaperSizeRepository.save(ups);
            }
            createdUping.setUpingPaperSize(upingPaperSize);
            upingRepository.save(createdUping);
        }

        return toDto(createdUping);
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
    public UpingDto findById(Long id){
        Optional<Uping> optionalUping = upingRepository.findById(id);

        if (optionalUping.isPresent()) {
            Uping uping = optionalUping.get();
            return toDto(uping);
        } else {
            throw new RecordNotFoundException(String.format("Uping not found for id => %d", id));
        }
    }

    @Override
    public String deleteById(Long id) {
        Optional<Uping> optionalUping = upingRepository.findById(id);

        if (optionalUping.isPresent()) {
            Uping uping = optionalUping.get();
            upingRepository.deleteById(id);
        } else {
            throw new RecordNotFoundException(String.format("Uping not found for id => %d", id));
        }
        return null;
    }

    @Transactional
    @Override
    public UpingDto updateUping(Long id, UpingDto upingDto) {
        Uping uping = toEntity(upingDto);
        Optional<Uping> optionalUping = upingRepository.findById(id);
        int count = 0;

        if (optionalUping.isPresent()) {
            Uping existingUping = optionalUping.get();
            existingUping.setProductSize(uping.getProductSize());

            List<UpingPaperSize> existingUpsValues = existingUping.getUpingPaperSize();
            List<UpingPaperSize> newUpsValues = uping.getUpingPaperSize();
            List<UpingPaperSize> newValuesToAdd = new ArrayList<>();

            for (UpingPaperSize newValue : newUpsValues) {
                Optional<UpingPaperSize> existingValue = existingUpsValues.stream()
                        .filter(value -> value.getId().equals(newValue.getId())).findFirst();
                if (existingValue.isPresent()) {
                    UpingPaperSize existingUpsValue = existingValue.get();
                    existingUpsValue.setValue(newValue.getValue());
                    existingUpsValue.setPaperSize(paperSizeRepository.findById(newValue.getPaperSize().getId())
                            .orElseThrow(() -> new RecordNotFoundException(String.format("Paper Size not found for id => %d", newValue.getPaperSize().getId()))));
                } else {
                    newValue.setUping(existingUping);
                    newValuesToAdd.add(newValue);
                    count++;
                }
            }

            if (count > 0) {
                existingUpsValues.addAll(newValuesToAdd);
            }

            Uping updatedUping = upingRepository.save(existingUping);
            return toDto(updatedUping);

        } else {
            throw new RecordNotFoundException(String.format("Uping not found for id => %d", id));
        }
    }

    @Override
    public void deleteUpingPaperSizeById(Long id, Long upingPaperSizeId) {
        Optional<Uping> optionalUping = upingRepository.findById(id);
        if (optionalUping.isPresent()) {
            Uping uping = optionalUping.get();

            Optional<UpingPaperSize> optionalUpingPaperSize = uping.getUpingPaperSize()
                    .stream()
                    .filter(ups -> ups.getId().equals(upingPaperSizeId))
                    .findFirst();

            if (optionalUpingPaperSize.isPresent()) {
                UpingPaperSize upingPaperSizeToDelete = optionalUpingPaperSize.get();
                uping.getUpingPaperSize().remove(upingPaperSizeToDelete);
                upingPaperSizeRepository.delete(upingPaperSizeToDelete);
                upingRepository.save(uping);
            } else{
            throw new RecordNotFoundException("Uping Paper Size not found");
            }
        } else {
            throw new RecordNotFoundException(String.format("Uping not found for id => %d", id));
        }
    }

    public UpingDto toDto(Uping uping) {
        List<UpingPaperSizeDto> upingPaperSizeDto = new ArrayList<>();
        for (UpingPaperSize upingPaperSize : uping.getUpingPaperSize()) {
            UpingPaperSizeDto upingDto = UpingPaperSizeDto.builder()
                    .id(upingPaperSize.getId())
                    .paperSize(upingPaperSize.getPaperSize().getId())
                    .value(upingPaperSize.getValue())
                    .build();
            upingPaperSizeDto.add(upingDto);
        }

        return UpingDto.builder()
                .id(uping.getId())
                .productSize(uping.getProductSize())
                .upingPaperSize(upingPaperSizeDto)
                .build();
    }


    public Uping toEntity(UpingDto upingDto) {
        Uping uping = Uping.builder()
                .id(upingDto.getId())
                .productSize(upingDto.getProductSize())
                .build();

        List<UpingPaperSize> upingPaperSizes = new ArrayList<>();
        for (UpingPaperSizeDto Dto : upingDto.getUpingPaperSize()) {
            PaperSize paperSize = PaperSize.builder()
                    .id(Dto.getPaperSize())
                    .build();

            UpingPaperSize upingPaperSize = UpingPaperSize.builder()
                    .id(Dto.getId())
                    .paperSize(paperSize)
                    .uping(uping)
                    .value(Dto.getValue())
                    .build();
            upingPaperSizes.add(upingPaperSize);
        }

        uping.setUpingPaperSize(upingPaperSizes);
        return uping;
    }


}

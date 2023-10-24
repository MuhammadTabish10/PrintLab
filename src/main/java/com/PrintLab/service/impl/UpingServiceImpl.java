package com.PrintLab.service.impl;

import com.PrintLab.dto.PaginationResponse;
import com.PrintLab.dto.PaperMarketRatesDto;
import com.PrintLab.dto.UpingDto;
import com.PrintLab.dto.UpingPaperSizeDto;
import com.PrintLab.exception.RecordNotFoundException;
import com.PrintLab.model.*;
import com.PrintLab.repository.PaperSizeRepository;
import com.PrintLab.repository.UpingPaperSizeRepository;
import com.PrintLab.repository.UpingRepository;
import com.PrintLab.service.UpingService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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
    private final PaperSizeServiceImpl paperSizeService;

    public UpingServiceImpl(UpingRepository upingRepository, UpingPaperSizeRepository upingPaperSizeRepository, PaperSizeRepository paperSizeRepository, PaperSizeServiceImpl paperSizeService) {
        this.upingRepository = upingRepository;
        this.upingPaperSizeRepository = upingPaperSizeRepository;
        this.paperSizeRepository = paperSizeRepository;
        this.paperSizeService = paperSizeService;
    }


    @Transactional
    @Override
    public UpingDto save(UpingDto upingDto) {
        Uping uping = toEntity(upingDto);
        uping.setStatus(true);
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
        List<Uping> upingList = upingRepository.findAllByStatusIsTrue();
        List<UpingDto> upingDtoList = new ArrayList<>();

        for (Uping uping : upingList) {
            UpingDto upingDto = toDto(uping);
            upingDtoList.add(upingDto);
        }
        return upingDtoList;
    }

    @Override
    public PaginationResponse getAllPaginatedUping(Integer pageNumber, Integer pageSize) {
        Pageable page = PageRequest.of(pageNumber,pageSize);
        Page<Uping> pageUping = upingRepository.findAllByStatusIsTrue(page);
        List<Uping> upingList = pageUping.getContent();

        List<UpingDto> upingDtoList = new ArrayList<>();
        for (Uping uping : upingList) {
            UpingDto upingDto = toDto(uping);
            upingDtoList.add(upingDto);
        }

        PaginationResponse paginationResponse = new PaginationResponse();
        paginationResponse.setContent(upingDtoList);
        paginationResponse.setPageNumber(pageUping.getNumber());
        paginationResponse.setPageSize(pageUping.getSize());
        paginationResponse.setTotalElements(pageUping.getNumberOfElements());
        paginationResponse.setTotalPages(pageUping.getTotalPages());
        paginationResponse.setLastPage(pageUping.isLast());

        return paginationResponse;
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
    public UpingDto findByProductSize(String productSize) {
        Optional<Uping> upingOptional = Optional.ofNullable(upingRepository.findByProductSize(productSize));

        if(upingOptional.isPresent()){
            Uping uping = upingOptional.get();
            return toDto(uping);
        }
        else {
            throw new RecordNotFoundException(String.format("Uping not found at => %s", productSize));
        }
    }

    @Override
    public List<UpingDto> searchByProductSize(String productSize) {
        List<Uping> upingList = upingRepository.findUpingByProductSize(productSize);
        List<UpingDto> upingDtoList = new ArrayList<>();

        for (Uping uping : upingList) {
            UpingDto upingDto = toDto(uping);
            upingDtoList.add(upingDto);
        }
        return upingDtoList;
    }

    @Override
    public List<UpingDto> getUpingByPaperSizeId(Long paperSizeId) {
        Optional<List<Uping>> optionalUpingList = Optional.ofNullable(upingRepository.findByUpingPaperSize_PaperSize_Id(paperSizeId));
        if(optionalUpingList.isPresent()){
            List<Uping> upingList = optionalUpingList.get();
            List<UpingDto> upingDtoList = new ArrayList<>();

            for (Uping uping : upingList) {
                UpingDto upingDto = toDto(uping);
                upingDtoList.add(upingDto);
            }
            return upingDtoList;
        } else{
            throw new RecordNotFoundException(String.format("Uping not found on Paper Size id => %d", paperSizeId));
        }
    }

    @Transactional
    @Override
    public String deleteById(Long id) {
        Optional<Uping> optionalUping = upingRepository.findById(id);

        if (optionalUping.isPresent()) {
            Uping uping = optionalUping.get();
            upingRepository.setStatusInactive(id);
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
            existingUping.setCategory(uping.getCategory());
            existingUping.setL1(uping.getL1());
            existingUping.setL2(uping.getL2());
            existingUping.setUnit(uping.getUnit());
            existingUping.setMm(uping.getMm());
            existingUping.setInch(uping.getInch());
            existingUping.setStatus(uping.getStatus());

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
                    .value(upingPaperSize.getValue())
                    .paperSize(paperSizeService.toDto(paperSizeRepository.findById(upingPaperSize.getPaperSize().getId())
                            .orElseThrow(()-> new RecordNotFoundException("Paper Size not found"))))
                    .build();
            upingPaperSizeDto.add(upingDto);
        }

        return UpingDto.builder()
                .id(uping.getId())
                .productSize(uping.getProductSize())
                .category(uping.getCategory())
                .l1(uping.getL1())
                .l2(uping.getL2())
                .unit(uping.getUnit())
                .mm(uping.getMm())
                .inch(uping.getInch())
                .status(uping.getStatus())
                .upingPaperSize(upingPaperSizeDto)
                .build();
    }


    public Uping toEntity(UpingDto upingDto) {
        Uping uping = Uping.builder()
                .id(upingDto.getId())
                .productSize(upingDto.getProductSize())
                .category(upingDto.getCategory())
                .l1(upingDto.getL1())
                .l2(upingDto.getL2())
                .unit(upingDto.getUnit())
                .mm(upingDto.getMm())
                .inch(upingDto.getInch())
                .status(upingDto.getStatus())
                .build();

        List<UpingPaperSize> upingPaperSizes = new ArrayList<>();
        for (UpingPaperSizeDto Dto : upingDto.getUpingPaperSize()) {
            PaperSize paperSize = PaperSize.builder()
                    .id(Dto.getPaperSize().getId())
                    .label(Dto.getPaperSize().getLabel())
                    .status(Dto.getPaperSize().getStatus())
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

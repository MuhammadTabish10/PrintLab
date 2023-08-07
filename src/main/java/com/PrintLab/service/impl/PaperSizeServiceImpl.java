package com.PrintLab.service.impl;

import com.PrintLab.dto.PaperSizeDto;
import com.PrintLab.dto.UpingPaperSizeDto;
import com.PrintLab.modal.*;
import com.PrintLab.repository.PaperSizeRepository;
import com.PrintLab.repository.UpingPaperSizeRepository;
import com.PrintLab.service.PaperSizeService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PaperSizeServiceImpl implements PaperSizeService
{
    private final PaperSizeRepository paperSizeRepository;
    private final UpingPaperSizeRepository upingPaperSizeRepository;

    public PaperSizeServiceImpl(PaperSizeRepository paperSizeRepository, UpingPaperSizeRepository upingPaperSizeRepository) {
        this.paperSizeRepository = paperSizeRepository;
        this.upingPaperSizeRepository = upingPaperSizeRepository;
    }

    @Override
    public PaperSizeDto save(PaperSizeDto paperSizeDto) {
        PaperSize paperSize = toEntity(paperSizeDto);
        PaperSize createdPaperSize = paperSizeRepository.save(paperSize);
        List<UpingPaperSize> upingPaperSizeList = new ArrayList<>();
        for(UpingPaperSizeDto data : paperSizeDto.getUpingPaperSize()){
            Uping uping = new Uping();
            uping.setId(data.getUpingId());
            UpingPaperSize upingPaperSize = UpingPaperSize.builder()
                    .paperSize(paperSize)
                    .uping(uping)
                    .value(data.getValue())
                    .build();

            upingPaperSizeList.add(upingPaperSize);
        }
        upingPaperSizeRepository.saveAll(upingPaperSizeList);
        return toDto(createdPaperSize);
    }

    @Override
    public List<PaperSizeDto> getAll() {
        List<PaperSize> paperSizeList = paperSizeRepository.findAll();
        List<PaperSizeDto> paperSizeDtoList = new ArrayList<>();

        for (PaperSize paperSize : paperSizeList) {
            PaperSizeDto paperSizeDto = toDto(paperSize);
            paperSizeDtoList.add(paperSizeDto);
        }
        return paperSizeDtoList;
    }

    @Override
    public PaperSizeDto findById(Long id) throws Exception {
        Optional<PaperSize> optionalPaperSize = paperSizeRepository.findById(id);

        if(optionalPaperSize.isPresent()) {
            PaperSize paperSize = optionalPaperSize.get();
            return toDto(paperSize);
        }
        else {
            throw new Exception("Paper Size not found with ID " + id);
        }
    }

    @Override
    public String deleteById(Long id) {
        Optional<PaperSize> optionalPaperSize = paperSizeRepository.findById(id);

        if(optionalPaperSize.isPresent()) {
            PaperSize paperSize = optionalPaperSize.get();
            paperSizeRepository.deleteById(id);
        }
        else{
            throw new IllegalArgumentException("Paper Size not found with ID " + id);
        }
        return null;
    }

    @Override
    public PaperSizeDto updatePaperSize(Long id, PaperSize paperSize) {
        Optional<PaperSize> optionalPaperSize = paperSizeRepository.findById(id);
        if(optionalPaperSize.isPresent()){
            PaperSize existingPs = optionalPaperSize.get();
            existingPs.setLabel(paperSize.getLabel());
            existingPs.setStatus(paperSize.getStatus());

            List<UpingPaperSize> existingUps = existingPs.getUpingPaperSize();
            List<UpingPaperSize> newUps = paperSize.getUpingPaperSize();

            for(UpingPaperSize newValue : newUps){
                Optional<UpingPaperSize> existingValue = existingUps.stream()
                        .filter(psValue -> psValue.getId().equals(newValue.getId())).findFirst();
                if(existingValue.isPresent()){
                    UpingPaperSize existingUPS = existingValue.get();
                    existingUPS.setValue(newValue.getValue());
                }
                else{
                    newValue.setPaperSize(existingPs);
                    existingUps.add(newValue);
                }
            }

            PaperSize updatedPs = paperSizeRepository.save(existingPs);
            return toDto(updatedPs);
        }
        else {
            throw new IllegalArgumentException("Paper Size not found with ID"+ id);
        }
    }

    @Override
    public UpingPaperSize addUpingPaperSize(Long paperSizeId, UpingPaperSize upingPaperSize) {
        Optional<PaperSize> paperSize = paperSizeRepository.findById(paperSizeId);
        if(paperSize.isPresent()) {
            upingPaperSize.setPaperSize(paperSize.get());
            return upingPaperSizeRepository.save(upingPaperSize);
        }
        throw new RuntimeException("Paper Size not found ");
    }

    @Override
    public void deleteUpingPaperSizeById(Long id, Long upingPaperSizeId) {
        Optional<PaperSize> optionalPaperSize = paperSizeRepository.findById(id);
        if (optionalPaperSize.isPresent()) {
            PaperSize paperSize = optionalPaperSize.get();

            // Find the PaperSizeSize entity with the provided upingPaperSizeId
            Optional<UpingPaperSize> optionalUpingPaperSize = paperSize.getUpingPaperSize()
                    .stream()
                    .filter(ups -> ups.getId().equals(upingPaperSizeId))
                    .findFirst();

            if (optionalUpingPaperSize.isPresent()) {
                UpingPaperSize upingPaperSizeToDelete = optionalUpingPaperSize.get();
                // Remove the UpingPaperSize entity from the list
                paperSize.getUpingPaperSize().remove(upingPaperSizeToDelete);

                // Delete the upingPaperSize from the database using the repository
                upingPaperSizeRepository.delete(upingPaperSizeToDelete);

                // Save the updated paperSize entity to reflect the changes in the database
                paperSizeRepository.save(paperSize);
            }
        } else {
            throw new RuntimeException("Paper Size not found.");
        }
    }


//    public PaperSizeDto toDto(PaperSize paperSize) {
//        return PaperSizeDto.builder()
//                .id(paperSize.getId())
//                .label(paperSize.getLabel())
//                .status(paperSize.getStatus())
//                .upingPaperSize(paperSize.getUpingPaperSize())
//                .build();
//    }

//    public PaperSize toEntity(PaperSizeDto paperSizeDto) {
//        return PaperSize.builder()
//                .id(paperSizeDto.getId())
//                .label(paperSizeDto.getLabel())
//                .status(paperSizeDto.getStatus())
//                .upingPaperSize(paperSizeDto.getUpingPaperSize())
//                .build();
//    }

    public PaperSize toEntity(PaperSizeDto paperSizeDto) {
        List<UpingPaperSize> upingPaperSizes = paperSizeDto.getUpingPaperSize().stream()
                .map(upingPaperSizeDto -> {
                    UpingPaperSize upingPaperSize = new UpingPaperSize();
                    Uping uping = new Uping();
                    uping.setId(upingPaperSizeDto.getUpingId());
                    upingPaperSize.setUping(uping);
                    upingPaperSize.setValue(upingPaperSizeDto.getValue());
                    return upingPaperSize;
                })
                .collect(Collectors.toList());

        return PaperSize.builder()
                .id(paperSizeDto.getId())
                .label(paperSizeDto.getLabel())
                .status(paperSizeDto.getStatus())
                .upingPaperSize(upingPaperSizes)
                .build();
    }
    public PaperSizeDto toDto(PaperSize paperSize) {
        List<UpingPaperSizeDto> upingPaperSizeDtoList = paperSize.getUpingPaperSize().stream()
                .map(pSize -> {
                    UpingPaperSizeDto upingPaperSizeDto = new UpingPaperSizeDto();
                    upingPaperSizeDto.setUpingId(pSize.getUping().getId());
                    upingPaperSizeDto.setValue(pSize.getValue());
                    return upingPaperSizeDto;
                })
                .collect(Collectors.toList());

        return PaperSizeDto.builder()
                .id(paperSize.getId())
                .label(paperSize.getLabel())
                .status(paperSize.getStatus())
                .upingPaperSize(upingPaperSizeDtoList)
                .build();
    }
}

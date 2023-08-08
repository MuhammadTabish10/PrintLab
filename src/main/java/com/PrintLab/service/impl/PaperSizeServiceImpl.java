package com.PrintLab.service.impl;

import com.PrintLab.dto.PaperSizeDto;
import com.PrintLab.dto.UpingPaperSizeDto;
import com.PrintLab.exception.RecordNotFoundException;
import com.PrintLab.modal.*;
import com.PrintLab.repository.PaperSizeRepository;
import com.PrintLab.repository.UpingPaperSizeRepository;
import com.PrintLab.repository.UpingRepository;
import com.PrintLab.service.PaperSizeService;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PaperSizeServiceImpl implements PaperSizeService {
    private final PaperSizeRepository paperSizeRepository;
    private final UpingRepository upingRepository;
    private final UpingPaperSizeRepository upingPaperSizeRepository;

    public PaperSizeServiceImpl(PaperSizeRepository paperSizeRepository, UpingRepository upingRepository, UpingPaperSizeRepository upingPaperSizeRepository) {
        this.paperSizeRepository = paperSizeRepository;
        this.upingRepository = upingRepository;
        this.upingPaperSizeRepository = upingPaperSizeRepository;
    }


//    @Transactional
//    @Override
//    public PaperSizeDto save(PaperSizeDto paperSizeDto) {
//        PaperSize paperSize = toEntity(paperSizeDto);
//        PaperSize createdPaperSize = paperSizeRepository.save(paperSize);
//        List<UpingPaperSize> upingPaperSizeList = new ArrayList<>();
//        for(UpingPaperSizeDto data : paperSizeDto.getUpingPaperSize()){
//            Uping uping = new Uping();
//            uping.setId(data.getUpingId());
//            UpingPaperSize upingPaperSize = UpingPaperSize.builder()
//                    .paperSize(paperSize)
//                    .uping(uping)
//                    .value(data.getValue())
//                    .build();
//
//            upingPaperSizeList.add(upingPaperSize);
//        }
//        upingPaperSizeRepository.saveAll(upingPaperSizeList);
//        return toDto(createdPaperSize);
//    }

    @Transactional
    @Override
    public PaperSizeDto save(PaperSizeDto paperSizeDto) {
        PaperSize paperSize = toEntity(paperSizeDto);
        PaperSize createdPaperSize = paperSizeRepository.save(paperSize);

        List<UpingPaperSize> upingPaperSizeList = new ArrayList<>();

        // Iterate over the provided UpingPaperSizeDto items
        for (UpingPaperSizeDto data : paperSizeDto.getUpingPaperSize()) {
            Long upingId = data.getUpingId();

            // Check if an UpingPaperSize with the same upingId already exists
            Optional<UpingPaperSize> existingUpingPaperSize = upingPaperSizeRepository.findByUpingIdAndPaperSizeId(upingId, createdPaperSize.getId());

            if (existingUpingPaperSize.isPresent()) {
                // Update the existing UpingPaperSize's value
                existingUpingPaperSize.get().setValue(data.getValue());
                upingPaperSizeList.add(existingUpingPaperSize.get());
            } else {
                // Create a new UpingPaperSize instance
                Uping uping = upingRepository.findById(upingId)
                        .orElseThrow(() -> new RecordNotFoundException("Uping not found with ID " + upingId));

                UpingPaperSize upingPaperSize = UpingPaperSize.builder()
                        .paperSize(createdPaperSize)
                        .uping(uping)
                        .value(data.getValue())
                        .build();

                upingPaperSizeList.add(upingPaperSize);
            }
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

        if (optionalPaperSize.isPresent()) {
            PaperSize paperSize = optionalPaperSize.get();
            return toDto(paperSize);
        } else {
            throw new Exception("Paper Size not found with ID " + id);
        }
    }

    @Override
    public String deleteById(Long id) {
        Optional<PaperSize> optionalPaperSize = paperSizeRepository.findById(id);

        if (optionalPaperSize.isPresent()) {
            PaperSize paperSize = optionalPaperSize.get();
            paperSizeRepository.deleteById(id);
        } else {
            throw new IllegalArgumentException("Paper Size not found with ID " + id);
        }
        return null;
    }

    @Override
    public PaperSizeDto updatePaperSize(Long id, PaperSizeDto paperSizeDto) {
        Optional<PaperSize> optionalPaperSize = paperSizeRepository.findById(id);
        if (optionalPaperSize.isPresent()) {
            PaperSize existingPs = optionalPaperSize.get();
            // Update label and status directly from paperSizeDto
            existingPs.setLabel(paperSizeDto.getLabel());
            existingPs.setStatus(paperSizeDto.getStatus());

            // Update UpingPaperSize values using streams
            List<UpingPaperSize> updatedUps = paperSizeDto.getUpingPaperSize().stream()
                    .map(data -> {
                        UpingPaperSize existingUp = existingPs.getUpingPaperSize().stream()
                                .filter(up -> up.getUping().getId().equals(data.getUpingId()))
                                .findFirst()
                                .orElseGet(() -> {
                                    Uping uping = upingRepository.findById(data.getUpingId())
                                            .orElseThrow(() -> new EntityNotFoundException("Uping not found with ID " + data.getUpingId()));
                                    return UpingPaperSize.builder()
                                            .paperSize(existingPs)
                                            .uping(uping)
                                            .build();
                                });
                        existingUp.setValue(data.getValue());
                        return existingUp;
                    })
                    .collect(Collectors.toList());

            existingPs.setUpingPaperSize(updatedUps);
            PaperSize updatedPs = paperSizeRepository.save(existingPs);
            return toDto(updatedPs);
        } else {
            throw new IllegalArgumentException("Paper Size not found with ID " + id);
        }
    }


//    @Override
//    public UpingPaperSize addUpingPaperSize(Long paperSizeId, UpingPaperSize upingPaperSize) {
//        Optional<PaperSize> paperSizeOptional = paperSizeRepository.findById(paperSizeId);
//
//        if (paperSizeOptional.isPresent()) {
//            PaperSize paperSize = paperSizeOptional.get();
//            upingPaperSize.setPaperSize(paperSize);
//            return upingPaperSizeRepository.save(upingPaperSize);
//        }
//
//        throw new EntityNotFoundException("Paper Size not found for ID: " + paperSizeId);
//    }

    @Transactional
    @Override
    public UpingPaperSize addUpingPaperSize(Long paperSizeId, UpingPaperSize upingPaperSize) {
        Optional<PaperSize> paperSizeOptional = paperSizeRepository.findById(paperSizeId);

        if (paperSizeOptional.isPresent()) {
            PaperSize paperSize = paperSizeOptional.get();

            // Ensure that the Uping entity is properly associated
            Long upingId = upingPaperSize.getUping().getId();
            Optional<Uping> upingOptional = upingRepository.findById(upingId);

            if (upingOptional.isPresent()) {
                Uping uping = upingOptional.get();

                // Set the Uping entity and its ID in UpingPaperSize
                upingPaperSize.setPaperSize(paperSize);
                upingPaperSize.setUping(uping);

                // Save and return the UpingPaperSize entity
                return upingPaperSizeRepository.save(upingPaperSize);
            } else {
                throw new EntityNotFoundException("Uping not found for ID: " + upingId);
            }
        }

        throw new EntityNotFoundException("Paper Size not found for ID: " + paperSizeId);
    }




    @Override
    public void deleteUpingPaperSizeById(Long id, Long upingPaperSizeId) {
        Optional<PaperSize> optionalPaperSize = paperSizeRepository.findById(id);

        if (optionalPaperSize.isPresent()) {
            PaperSize paperSize = optionalPaperSize.get();

            Optional<UpingPaperSize> optionalUpingPaperSize = paperSize.getUpingPaperSize()
                    .stream()
                    .filter(ups -> ups.getId().equals(upingPaperSizeId))
                    .findFirst();

            optionalUpingPaperSize.ifPresent(upingPaperSize -> {
                paperSize.getUpingPaperSize().remove(upingPaperSize);
                upingPaperSizeRepository.deleteById(upingPaperSize.getId());
            });
        } else {
            throw new EntityNotFoundException("Paper Size not found.");
        }
    }


    public PaperSizeDto toDto(PaperSize paperSize) {
        List<UpingPaperSizeDto> upingPaperSizeDtos = new ArrayList<>();
        for (UpingPaperSize upingPaperSize : paperSize.getUpingPaperSize()) {
            UpingPaperSizeDto upingDto = UpingPaperSizeDto.builder()
                    .upingId(upingPaperSize.getUping().getId())
                    .value(upingPaperSize.getValue())
                    .build();
            upingPaperSizeDtos.add(upingDto);
        }

        return PaperSizeDto.builder()
                .id(paperSize.getId())
                .label(paperSize.getLabel())
                .status(paperSize.getStatus())
                .upingPaperSize(upingPaperSizeDtos)
                .build();
    }


    public PaperSize toEntity(PaperSizeDto dto) {
        PaperSize paperSize = PaperSize.builder()
                .id(dto.getId())
                .label(dto.getLabel())
                .status(dto.getStatus())
                .build();

        List<UpingPaperSize> upingPaperSizes = new ArrayList<>();
        for (UpingPaperSizeDto upingDto : dto.getUpingPaperSize()) {
            Uping uping = Uping.builder()
                    .id(upingDto.getUpingId()) // Set the Uping ID
                    .build();

            UpingPaperSize upingPaperSize = UpingPaperSize.builder()
                    .paperSize(paperSize)
                    .uping(uping)
                    .value(upingDto.getValue())
                    .build();
            upingPaperSizes.add(upingPaperSize);
        }

        paperSize.setUpingPaperSize(upingPaperSizes);
        return paperSize;
    }


}

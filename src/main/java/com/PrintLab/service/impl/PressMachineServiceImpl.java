package com.PrintLab.service.impl;

import com.PrintLab.dto.PressMachineDto;
import com.PrintLab.dto.PressMachineSizeDto;
import com.PrintLab.exception.RecordNotFoundException;
import com.PrintLab.modal.*;
import com.PrintLab.repository.PaperSizeRepository;
import com.PrintLab.repository.PressMachineRepository;
import com.PrintLab.repository.PressMachineSizeRepository;
import com.PrintLab.service.PressMachineService;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PressMachineServiceImpl implements PressMachineService {
    private final PressMachineRepository pressMachineRepository;
    private final PressMachineSizeRepository pressMachineSizeRepository;
    private final PaperSizeRepository paperSizeRepository;

    public PressMachineServiceImpl(PressMachineRepository pressMachineRepository, PressMachineSizeRepository pressMachineSizeRepository, PaperSizeRepository paperSizeRepository) {
        this.pressMachineRepository = pressMachineRepository;
        this.pressMachineSizeRepository = pressMachineSizeRepository;
        this.paperSizeRepository = paperSizeRepository;
    }

    @Transactional
    @Override
    public PressMachineDto save(PressMachineDto pressMachineDto) {
        PressMachine pressMachine = toEntity(pressMachineDto);
        PressMachine createdPressMachine = pressMachineRepository.save(pressMachine);

        List<PressMachineSize> pressMachineSize = pressMachine.getPressMachineSize();
        if (pressMachineSize != null && !pressMachineSize.isEmpty()) {
            for (PressMachineSize pms : pressMachineSize) {
                pms.setPressMachine(createdPressMachine);
                pms.setPaperSize(paperSizeRepository.findById(pms.getPaperSize().getId())
                        .orElseThrow(() -> new RecordNotFoundException(String.format("Paper Size not found for id => %d", pms.getPaperSize().getId()))));
                pressMachineSizeRepository.save(pms);
            }
            createdPressMachine.setPressMachineSize(pressMachineSize);
            pressMachineRepository.save(createdPressMachine);
        }
        return toDto(createdPressMachine);
    }


    @Override
    public List<PressMachineDto> getAll() {
        List<PressMachine> pressMachineList = pressMachineRepository.findAll();
        List<PressMachineDto> pressMachineDtoList = new ArrayList<>();

        for (PressMachine pressMachine : pressMachineList) {
            PressMachineDto pressMachineDto = toDto(pressMachine);
            pressMachineDtoList.add(pressMachineDto);
        }
        return pressMachineDtoList;
    }

    @Override
    public PressMachineDto findById(Long id){
        Optional<PressMachine> optionalPressMachine = pressMachineRepository.findById(id);

        if (optionalPressMachine.isPresent()) {
            PressMachine pressMachine = optionalPressMachine.get();
            return toDto(pressMachine);
        } else {
            throw new RecordNotFoundException(String.format("Press Machine not found for id => %d", id));
        }
    }

    @Override
    public List<PressMachineDto> getPressMachineByPaperSizeId(Long paperSizeId) {
        Optional<List<PressMachine>> optionalPressMachineList = Optional.ofNullable(pressMachineRepository.findByPressMachineSize_PaperSize_Id(paperSizeId));
        if(optionalPressMachineList.isPresent()){
            List<PressMachine> pressMachineList = optionalPressMachineList.get();
            List<PressMachineDto> pressMachineDtoList = new ArrayList<>();

            for (PressMachine pressMachine : pressMachineList) {
                PressMachineDto pressMachineDto = toDto(pressMachine);
                pressMachineDtoList.add(pressMachineDto);
            }
            return pressMachineDtoList;
        } else{
            throw new RecordNotFoundException(String.format("PressMachine not found on Paper Size id => %d", paperSizeId));
        }
    }

    @Override
    public String deleteById(Long id) {
        Optional<PressMachine> optionalPressMachine = pressMachineRepository.findById(id);

        if (optionalPressMachine.isPresent()) {
            PressMachine pressMachine = optionalPressMachine.get();
            pressMachineRepository.deleteById(id);
        } else {
            throw new RecordNotFoundException(String.format("Press Machine not found for id => %d", id));
        }
        return null;
    }

    @Transactional
    @Override
    public PressMachineDto updatePressMachine(Long id, PressMachineDto pressMachineDto) {
        PressMachine pressMachine = toEntity(pressMachineDto);
        Optional<PressMachine> optionalPressMachine = pressMachineRepository.findById(id);
        int count = 0;

        if (optionalPressMachine.isPresent()) {
            PressMachine existingPressMachine = optionalPressMachine.get();
            existingPressMachine.setName(pressMachine.getName());
            existingPressMachine.setCtp_rate(pressMachine.getCtp_rate());
            existingPressMachine.setImpression_1000_rate(pressMachine.getImpression_1000_rate());
            existingPressMachine.setIs_selected(pressMachine.getIs_selected());

            List<PressMachineSize> existingPmsValues = existingPressMachine.getPressMachineSize();
            List<PressMachineSize> newPmsValues = pressMachine.getPressMachineSize();
            List<PressMachineSize> newValuesToAdd = new ArrayList<>();

            for (PressMachineSize newValue : newPmsValues) {
                Optional<PressMachineSize> existingValue = existingPmsValues.stream()
                        .filter(pmValue -> pmValue.getId().equals(newValue.getId())).findFirst();
                if (existingValue.isPresent()) {
                    PressMachineSize existingPmsValue = existingValue.get();
                    existingPmsValue.setValue(newValue.getValue());
                    existingPmsValue.setPaperSize(paperSizeRepository.findById(newValue.getPaperSize().getId())
                            .orElseThrow(() -> new RecordNotFoundException(String.format("Paper Size not found for id => %d", newValue.getPaperSize().getId()))));
                } else {
                    newValue.setPressMachine(existingPressMachine);
                    newValuesToAdd.add(newValue);
                    count++;
                }
            }
            if(count > 0){
                existingPmsValues.addAll(newValuesToAdd);
            }
            PressMachine updatedPm = pressMachineRepository.save(existingPressMachine);
            return toDto(updatedPm);
        } else {
            throw new RecordNotFoundException(String.format("Press Machine not found for id => %d", id));
        }
    }

    @Override
    public void deletePressMachineSizeById(Long id, Long pressMachineSizeId) {
        Optional<PressMachine> optionalPressMachine = pressMachineRepository.findById(id);
        if (optionalPressMachine.isPresent()) {
            PressMachine pressMachine = optionalPressMachine.get();

            // Find the PressMachineSize entity with the provided pressMachineSizeId
            Optional<PressMachineSize> optionalPressMachineSize = pressMachine.getPressMachineSize()
                    .stream()
                    .filter(pms -> pms.getId().equals(pressMachineSizeId))
                    .findFirst();

            if (optionalPressMachineSize.isPresent()) {
                PressMachineSize pressMachineSizeToDelete = optionalPressMachineSize.get();
                // Remove the PressMachineSize entity from the list
                pressMachine.getPressMachineSize().remove(pressMachineSizeToDelete);

                // Delete the pressMachineSize from the database using the repository
                pressMachineSizeRepository.delete(pressMachineSizeToDelete);

                // Save the updated pressMachine entity to reflect the changes in the database
                pressMachineRepository.save(pressMachine);
            } else{
                throw new RecordNotFoundException("Press Machine Size not found");
            }
        } else {
            throw new RecordNotFoundException(String.format("Press Machine not found for id => %d", id));

        }
    }

    public PressMachineDto toDto(PressMachine pressMachine) {
        List<PressMachineSizeDto> pressMachineSizeDtos = pressMachine.getPressMachineSize().stream()
                .map(pmSize -> {
                    PressMachineSizeDto pmSizeDto = new PressMachineSizeDto();
                    pmSizeDto.setPaperSize(pmSize.getPaperSize().getId());
                    pmSizeDto.setValue(Long.valueOf(pmSize.getValue()));
                    pmSizeDto.setId(pmSize.getId());
                    return pmSizeDto;
                })
                .collect(Collectors.toList());

        return PressMachineDto.builder()
                .id(pressMachine.getId())
                .name(pressMachine.getName())
                .ctp_rate(pressMachine.getCtp_rate())
                .impression_1000_rate(pressMachine.getImpression_1000_rate())
                .is_selected(pressMachine.getIs_selected())
                .pressMachineSize(pressMachineSizeDtos)
                .build();
    }


    public PressMachine toEntity(PressMachineDto pressMachineDto) {
        List<PressMachineSize> pressMachineSizes = pressMachineDto.getPressMachineSize().stream()
                .map(pmSizeDto -> {
                    PressMachineSize pressMachineSize = new PressMachineSize();
                    PaperSize paperSize = new PaperSize();
                    paperSize.setId(pmSizeDto.getPaperSize());

                    pressMachineSize.setId(pmSizeDto.getId());
                    pressMachineSize.setPaperSize(paperSize);
                    pressMachineSize.setValue(pmSizeDto.getValue().intValue());
                    return pressMachineSize;
                })
                .collect(Collectors.toList());

        return PressMachine.builder()
                .id(pressMachineDto.getId())
                .name(pressMachineDto.getName())
                .ctp_rate(pressMachineDto.getCtp_rate())
                .impression_1000_rate(pressMachineDto.getImpression_1000_rate())
                .is_selected(pressMachineDto.getIs_selected())
                .pressMachineSize(pressMachineSizes)
                .build();
    }
}

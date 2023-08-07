package com.PrintLab.service.impl;

import com.PrintLab.dto.PressMachineDto;

import com.PrintLab.dto.PressMachineSizeDto;
import com.PrintLab.modal.PaperSize;
import com.PrintLab.modal.PressMachine;
import com.PrintLab.modal.PressMachineSize;
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
public class PressMachineImpl implements PressMachineService
{
    private final PressMachineRepository pressMachineRepository;
    private final PressMachineSizeRepository pressMachineSizeRepository;

    public PressMachineImpl(PressMachineRepository pressMachineRepository, PressMachineSizeRepository pressMachineSizeRepository) {
        this.pressMachineRepository = pressMachineRepository;
        this.pressMachineSizeRepository = pressMachineSizeRepository;
    }


    @Transactional
    @Override
    public PressMachineDto save(PressMachineDto pressMachineDto) {

        PressMachine pressMachine = toEntity(pressMachineDto);
        PressMachine createdPressMachine = pressMachineRepository.save(pressMachine);
        List<PressMachineSize> pressMachineSizeList = new ArrayList<>();
        for(PressMachineSizeDto data : pressMachineDto.getPressMachineSize()){
            PaperSize paperSize = new PaperSize();
            paperSize.setId(data.getPaperSizeId());
            PressMachineSize pm = PressMachineSize.builder()
                    .pressMachine(pressMachine)
                    .paperSize(paperSize)
                    .value(data.getValue().intValue())
                    .build();

            pressMachineSizeList.add(pm);
        }
       pressMachineSizeRepository.saveAll(pressMachineSizeList);


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
    public PressMachineDto findById(Long id) throws Exception {
        Optional<PressMachine> optionalPressMachine = pressMachineRepository.findById(id);

        if(optionalPressMachine.isPresent()) {
            PressMachine pressMachine = optionalPressMachine.get();
            return toDto(pressMachine);
        }
        else {
            throw new Exception("Press Machine not found with ID " + id);
        }
    }

    @Override
    public String deleteById(Long id) {
        Optional<PressMachine> optionalPressMachine = pressMachineRepository.findById(id);

        if(optionalPressMachine.isPresent()) {
            PressMachine pressMachine = optionalPressMachine.get();
            pressMachineRepository.deleteById(id);
        }
        else {
            throw new IllegalArgumentException("Press Machine not found with ID " + id);
        }
        return null;
    }

    @Override
    public PressMachineDto updatePressMachine(Long id, PressMachine pressMachine) {
        Optional<PressMachine> optionalPressMachine = pressMachineRepository.findById(id);

        if(optionalPressMachine.isPresent()) {
            PressMachine existingPm = optionalPressMachine.get();
            existingPm.setName(pressMachine.getName());
            existingPm.setCtp_rate(pressMachine.getCtp_rate());
            existingPm.setImpression_1000_rate(pressMachine.getImpression_1000_rate());

            List<PressMachineSize> existingPressMachineSize = existingPm.getPressMachineSize();
            List<PressMachineSize> newPressMachineSize = pressMachine.getPressMachineSize();

            for(PressMachineSize newValue : newPressMachineSize) {
                Optional<PressMachineSize> existingValue = existingPressMachineSize.stream()
                        .filter(pmValue -> pmValue.getId().equals(newValue.getId())).findFirst();
                if(existingValue.isPresent()) {
                    PressMachineSize existingPMS = existingValue.get();
                    existingPMS.setValue(newValue.getValue());
                }
                else {
                    newValue.setPressMachine(existingPm);
                    existingPressMachineSize.add(newValue);
                }
            }

            PressMachine updatedPm = pressMachineRepository.save(existingPm);
            return toDto(updatedPm);
        }
        else {
            throw new IllegalArgumentException("Press Machine not found with ID"+ id);
        }
    }

    @Override
    public PressMachineSize addPressMachineSize(Long pressMachineId, PressMachineSize pressMachineSize) {
        Optional<PressMachine> pressMachine = pressMachineRepository.findById(pressMachineId);
        if(pressMachine.isPresent()) {
            pressMachineSize.setPressMachine(pressMachine.get());
            return pressMachineSizeRepository.save(pressMachineSize);
        }
        throw new RuntimeException("Press Machine not found ");
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
            }
        } else {
            throw new RuntimeException("Press Machine not found.");

        }
    }

//    public PressMachineDto toDto(PressMachine pressMachine) {
//        return PressMachineDto.builder()
//                .id(pressMachine.getId())
//                .name(pressMachine.getName())
//                .ctp_rate(pressMachine.getCtp_rate())
//                .impression_1000_rate(pressMachine.getImpression_1000_rate())
//                .pressMachineSize(pressMachine.getPressMachineSize())
//                .build();
//    }

    public PressMachineDto toDto(PressMachine pressMachine) {
        List<PressMachineSizeDto> pressMachineSizeDtos = pressMachine.getPressMachineSize().stream()
                .map(pmSize -> {
                    PressMachineSizeDto pmSizeDto = new PressMachineSizeDto();
                    pmSizeDto.setPaperSizeId(pmSize.getPaperSize().getId());
                    pmSizeDto.setValue(Long.valueOf(pmSize.getValue()));
                    // You can set other fields in the PressMachineSizeDto if needed
                    return pmSizeDto;
                })
                .collect(Collectors.toList());

        return PressMachineDto.builder()
                .id(pressMachine.getId())
                .name(pressMachine.getName())
                .ctp_rate(pressMachine.getCtp_rate())
                .impression_1000_rate(pressMachine.getImpression_1000_rate())
                .pressMachineSize(pressMachineSizeDtos)
                .build();
    }


    public PressMachine toEntity(PressMachineDto pressMachineDto) {
        List<PressMachineSize> pressMachineSizes = pressMachineDto.getPressMachineSize().stream()
                .map(pmSizeDto -> {
                    PressMachineSize pressMachineSize = new PressMachineSize();
                    PaperSize paperSize = new PaperSize();
                    paperSize.setId(pmSizeDto.getPaperSizeId());
                    // You can set other fields in the PaperSize entity if needed

                    pressMachineSize.setPaperSize(paperSize);
                    pressMachineSize.setValue(pmSizeDto.getValue().intValue()); // Convert Long to Integer
                    // You can set other fields in the PressMachineSize entity if needed

                    return pressMachineSize;
                })
                .collect(Collectors.toList());

        return PressMachine.builder()
                .id(pressMachineDto.getId())
                .name(pressMachineDto.getName())
                .ctp_rate(pressMachineDto.getCtp_rate())
                .impression_1000_rate(pressMachineDto.getImpression_1000_rate())
                .pressMachineSize(pressMachineSizes)
                .build();
    }



//    public PressMachine toEntity(PressMachineDto pressMachineDto) {
//        return PressMachine.builder()
//                .id(pressMachineDto.getId())
//                .name(pressMachineDto.getName())
//                .ctp_rate(pressMachineDto.getCtp_rate())
//                .impression_1000_rate(pressMachineDto.getImpression_1000_rate())
//                .pressMachineSize(pressMachineDto.getPressMachineSize())
//                .build();
//    }








}

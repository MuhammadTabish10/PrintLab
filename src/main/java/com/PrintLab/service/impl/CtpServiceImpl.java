package com.PrintLab.service.impl;

import com.PrintLab.dto.CtpDto;
import com.PrintLab.exception.RecordNotFoundException;
import com.PrintLab.model.Ctp;
import com.PrintLab.repository.CtpRepository;
import com.PrintLab.repository.VendorRepository;
import com.PrintLab.service.CtpService;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CtpServiceImpl implements CtpService {

    private final CtpRepository ctpRepository;
    private final VendorRepository vendorRepository;

    public CtpServiceImpl(CtpRepository ctpRepository, VendorRepository vendorRepository) {
        this.ctpRepository = ctpRepository;
        this.vendorRepository = vendorRepository;
    }

    @Override
    public CtpDto save(CtpDto ctpDto) {
        ctpDto.setStatus(true);
        Ctp ctp = ctpRepository.save(toEntity(ctpDto));
        return toDto(ctp);
    }

    @Override
    public List<CtpDto> getAll() {
        List<Ctp> ctpList = ctpRepository.findAll();
        List<CtpDto> ctpDtoList = new ArrayList<>();

        for (Ctp ctp : ctpList) {
            CtpDto ctpDto = toDto(ctp);
            ctpDtoList.add(ctpDto);
        }
        return ctpDtoList;
    }

    @Override
    public CtpDto getById(Long id) {
        Optional<Ctp> optionalCtp = ctpRepository.findById(id);

        if (optionalCtp.isPresent()) {
            Ctp ctp = optionalCtp.get();
            return toDto(ctp);
        } else {
            throw new RecordNotFoundException(String.format("Ctp not found for id => %d", id));
        }
    }

    @Transactional
    @Override
    public String deleteById(Long id) {
        Optional<Ctp> optionalCtp = ctpRepository.findById(id);

        if (optionalCtp.isPresent()) {
            Ctp ctp = optionalCtp.get();
            ctpRepository.setStatusInactive(id);
        } else {
            throw new RecordNotFoundException(String.format("Ctp not found for id => %d", id));
        }
        return null;
    }

    @Transactional
    @Override
    public CtpDto update(Long id, CtpDto ctpDto) {
        Optional<Ctp> optionalCtp = ctpRepository.findById(id);
        if (optionalCtp.isPresent()) {
            Ctp existingCtp = optionalCtp.get();
            existingCtp.setDate(ctpDto.getDate());
            existingCtp.setL1(ctpDto.getL1());
            existingCtp.setL2(ctpDto.getL2());
            existingCtp.setPlateDimension(ctpDto.getPlateDimension());
            existingCtp.setRate(ctpDto.getRate());

            existingCtp.setVendor(vendorRepository.findById(ctpDto.getVendor().getId())
                    .orElseThrow(()-> new RecordNotFoundException("Vendor not found at id => " + ctpDto.getVendor().getId())));

            Ctp updatedCtp = ctpRepository.save(existingCtp);
            return toDto(updatedCtp);
        } else {
            throw new RecordNotFoundException(String.format("Ctp not found for id => %d", id));
        }
    }

    public CtpDto toDto(Ctp ctp) {
        return CtpDto.builder()
                .id(ctp.getId())
                .date(ctp.getDate())
                .l1(ctp.getL1())
                .l2(ctp.getL2())
                .plateDimension(ctp.getPlateDimension())
                .rate(ctp.getRate())
                .status(ctp.getStatus())
                .vendor(vendorRepository.findById(ctp.getVendor().getId())
                        .orElseThrow(()-> new RecordNotFoundException("Vendor not found")))
                .build();
    }

    public Ctp toEntity(CtpDto ctpDto) {
        return Ctp.builder()
                .id(ctpDto.getId())
                .date(ctpDto.getDate())
                .l1(ctpDto.getL1())
                .l2(ctpDto.getL2())
                .plateDimension(ctpDto.getPlateDimension())
                .rate(ctpDto.getRate())
                .status(ctpDto.getStatus())
                .vendor(vendorRepository.findById(ctpDto.getVendor().getId())
                        .orElseThrow(()-> new RecordNotFoundException("Vendor not found")))
                .build();
    }
}

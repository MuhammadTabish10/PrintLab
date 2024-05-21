package com.PrintLab.Mapper;

import com.PrintLab.dto.BusinessUnitProcessDto;
import com.PrintLab.model.BusinessUnitProcess;
import com.PrintLab.service.impl.VendorServiceImpl;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;
@Component
public class BusinessUnitProcessMapper {

    private final VendorServiceImpl vendorService;

    public BusinessUnitProcessMapper(VendorServiceImpl vendorService) {
        this.vendorService = vendorService;
    }

    public BusinessUnitProcessDto toProcessDto(BusinessUnitProcess process) {
        return BusinessUnitProcessDto.builder()
                .id(process.getId())
                .process(process.getProcess())
                .type(process.getType())
                .vendors(process.getVendors().stream()
                        .map(vendorService::toDto)
                        .collect(Collectors.toList()))
                .build();
    }

    public BusinessUnitProcess toProcessEntity(BusinessUnitProcessDto processDto) {
        return BusinessUnitProcess.builder()
                .id(processDto.getId())
                .process(processDto.getProcess())
                .type(processDto.getType())
                .vendors(processDto.getVendors().stream()
                        .map(vendorService::toVEntity)
                        .collect(Collectors.toList()))
                .build();
    }
}

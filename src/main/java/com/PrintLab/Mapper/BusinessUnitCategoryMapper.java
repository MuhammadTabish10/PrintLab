package com.PrintLab.Mapper;

import com.PrintLab.dto.BusinessUnitCategoryDto;
import com.PrintLab.dto.BusinessUnitProcessDto;
import com.PrintLab.dto.VendorDto;
import com.PrintLab.model.BusinessUnitCategory;
import com.PrintLab.model.BusinessUnitProcess;
import com.PrintLab.model.Vendor;
import com.PrintLab.service.impl.VendorServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class BusinessUnitCategoryMapper {

    @Autowired
    private VendorServiceImpl vendorMapper;

    public BusinessUnitCategoryDto toDto(BusinessUnitCategory category) {
        List<BusinessUnitProcessDto> processDtoList = category.getProcessList().stream()
                .map(process -> BusinessUnitProcessDto.builder()
                        .id(process.getId())
                        .process(process.getProcess())
                        .billable(process.isBillable())
                        .vendors(process.getVendors().stream()
                                .map(vendorMapper::toDto)
                                .collect(Collectors.toList()))
                        .build())
                .collect(Collectors.toList());

        return BusinessUnitCategoryDto.builder()
                .id(category.getId())
                .name(category.getName())
                .processList(processDtoList)
                .build();
    }


    public BusinessUnitCategory toEntity(BusinessUnitCategoryDto categoryDto) {
        List<BusinessUnitProcess> processList = categoryDto.getProcessList().stream()
                .map(processDto -> BusinessUnitProcess.builder()
                        .id(processDto.getId())
                        .process(processDto.getProcess())
                        .billable(processDto.isBillable())
                        .vendors(processDto.getVendors().stream()
                                .map(vendorMapper::toVEntity)
                                .collect(Collectors.toList()))
                        .build())
                .collect(Collectors.toList());

        return BusinessUnitCategory.builder()
                .id(categoryDto.getId())
                .name(categoryDto.getName())
                .processList(processList)
                .build();
    }

    public Vendor toEntity(VendorDto vendorDto) {
        return vendorMapper.toVEntity(vendorDto);
    }
}

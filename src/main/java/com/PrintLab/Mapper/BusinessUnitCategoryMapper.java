package com.PrintLab.Mapper;

import com.PrintLab.dto.BusinessUnitCategoryDto;
import com.PrintLab.dto.BusinessUnitProcessDto;
import com.PrintLab.dto.VendorDto;
import com.PrintLab.model.BusinessUnitCategory;
import com.PrintLab.model.BusinessUnitProcess;
import com.PrintLab.model.Vendor;
import com.PrintLab.service.impl.VendorServiceImpl;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class BusinessUnitCategoryMapper {


    private final VendorServiceImpl vendorMapper;
    private final ProductRuleMapper productRuleMapper;

    public BusinessUnitCategoryMapper(VendorServiceImpl vendorMapper, ProductRuleMapper productRuleMapper) {
        this.vendorMapper = vendorMapper;
        this.productRuleMapper = productRuleMapper;
    }

    public BusinessUnitCategoryDto toDto(BusinessUnitCategory category) {
        List<BusinessUnitProcessDto> processDtoList = category.getProcessList().stream()
                .map(process -> {
                    BusinessUnitProcessDto processDto = BusinessUnitProcessDto.builder()
                            .id(process.getId())
                            .process(process.getProcess())
                            .type(process.getType())
                            .vendors(process.getVendors().stream()
                                    .map(vendorMapper::toDto)
                                    .collect(Collectors.toList()))
                            .build();

                    if (process.getProductRuleList() != null) {
                        processDto.setProductRuleList(process.getProductRuleList().stream()
                                .map(productRuleMapper::toDto)
                                .collect(Collectors.toList()));
                    }

                    return processDto;
                })
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
                        .type(processDto.getType())
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

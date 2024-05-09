package com.PrintLab.Mapper;

import com.PrintLab.dto.ProductRuleJobDto;
import com.PrintLab.model.ProductRuleJob;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class ProductRuleJobMapper {
    private final BusinessUnitProcessMapper businessUnitProcessMapper;
    private final JobProcessedDetailsMapper detailMapper;

    public ProductRuleJobMapper(BusinessUnitProcessMapper businessUnitProcessMapper, JobProcessedDetailsMapper detailMapper) {
        this.businessUnitProcessMapper = businessUnitProcessMapper;
        this.detailMapper = detailMapper;
    }

    public ProductRuleJobDto toDto(ProductRuleJob productRuleJob) {
        return ProductRuleJobDto.builder()
                .id(productRuleJob.getId())
                .productName(productRuleJob.getProductName())
                .category(productRuleJob.getCategory())
                .sizeCategory(productRuleJob.getSizeCategory())
                .size(productRuleJob.getSize())
                .processList(productRuleJob.getProcessList().stream()
                        .map(businessUnitProcessMapper::toProcessDto)
                        .collect(Collectors.toList()))
                .processedDetailList(productRuleJob.getProcessedDetailList().stream()
                        .map(detailMapper::toDto)
                        .collect(Collectors.toList()))
                .type(productRuleJob.getType())
                .build();
    }

    public ProductRuleJob toEntity(ProductRuleJobDto productRuleJobDto) {
        return ProductRuleJob.builder()
                .id(productRuleJobDto.getId())
                .productName(productRuleJobDto.getProductName())
                .category(productRuleJobDto.getCategory())
                .sizeCategory(productRuleJobDto.getSizeCategory())
                .size(productRuleJobDto.getSize())
                .processList(productRuleJobDto.getProcessList().stream()
                        .map(businessUnitProcessMapper::toProcessEntity)
                        .collect(Collectors.toList()))
                .processedDetailList(productRuleJobDto.getProcessedDetailList().stream()
                        .map(detailMapper::toEntity)
                        .collect(Collectors.toList()))
                .type(productRuleJobDto.getType())
                .build();
    }
}

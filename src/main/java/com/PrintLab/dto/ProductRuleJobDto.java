package com.PrintLab.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class ProductRuleJobDto {
    private Long id;
    private String productName;
    private String sizeCategory;
    private String size;
    private String category;
    private List<BusinessUnitProcessDto> processList;
    private List<JobProcessedDetailsDto> processedDetailList;
    private String type;
}

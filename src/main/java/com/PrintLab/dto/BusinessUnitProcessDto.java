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
public class BusinessUnitProcessDto {
    private Long id;
    private String process;
    private boolean billable;
    private List<VendorDto> vendors;
    private List<ProductRuleJobDto> productRuleJobList;
    private BusinessUnitCategoryDto category;
}

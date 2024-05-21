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
    private String type;
    private List<VendorDto> vendors;
    private List<ProductRuleDto> productRuleJobList;
    private BusinessUnitCategoryDto category;
}

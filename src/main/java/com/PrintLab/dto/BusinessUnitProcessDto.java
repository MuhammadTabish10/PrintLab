package com.PrintLab.dto;

import lombok.*;

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
    @ToString.Exclude
    private BusinessUnitCategoryDto category;
}

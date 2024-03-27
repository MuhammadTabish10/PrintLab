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
public class BusinessUnitCategoryDto {
    private Long id;
    private String name;
    private List<BusinessUnitProcessDto> processList;
}

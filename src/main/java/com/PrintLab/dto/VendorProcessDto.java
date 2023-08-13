package com.PrintLab.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class VendorProcessDto
{
    private Long id;
    private Long productProcessId;
    private String materialType;
    private Double rateSqft;
    private String notes;
}

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
public class ProductDefinitionFieldDto
{
    private Long id;
    private Long value;
    private Boolean isPublic;
    private ProductFieldDto productField;
    private List<ProductFieldValuesDto> productFieldValues;
}

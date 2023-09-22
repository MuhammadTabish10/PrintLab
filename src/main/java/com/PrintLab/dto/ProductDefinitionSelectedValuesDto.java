package com.PrintLab.dto;

import com.PrintLab.model.ProductFieldValues;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class ProductDefinitionSelectedValuesDto
{
    private Long id;
    private String value;
    private ProductFieldValues productFieldValue;
}

package com.PrintLab.dto;

import com.PrintLab.modal.ProductDefinitionField;
import com.PrintLab.modal.ProductFieldValues;
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
    private ProductDefinitionField productDefinitionField;
    private ProductFieldValues productFieldValue;
}

package com.PrintLab.dto;

import com.PrintLab.modal.ProductField;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class ProductDefinitionFieldDto
{
    private Long id;
    private Long value;
    private ProductFieldDto productField;
}

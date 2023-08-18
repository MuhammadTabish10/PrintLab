package com.PrintLab.dto;


import com.PrintLab.modal.ProductFieldValues;
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
    private Boolean is_public;
    private ProductFieldDto productField;
}

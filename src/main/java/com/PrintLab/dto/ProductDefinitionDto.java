package com.PrintLab.dto;

import com.PrintLab.modal.ProductDefinitionField;
import com.PrintLab.modal.ProductField;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class ProductDefinitionDto {

    private Long id;

    private String title;
    private String status;


    private List<ProductDefinitionField> productDefinitionFieldList = new ArrayList<>();
}

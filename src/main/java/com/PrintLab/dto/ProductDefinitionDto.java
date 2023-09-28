package com.PrintLab.dto;

import com.PrintLab.model.NewProduct;
import com.PrintLab.model.PressMachine;
import com.PrintLab.model.ProductDefinition;
import com.PrintLab.model.ProductGsm;
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
    private Boolean status;
    private PressMachine pressMachine;
    private NewProductDto newProduct;
}

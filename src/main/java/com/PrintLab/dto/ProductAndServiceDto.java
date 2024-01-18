package com.PrintLab.dto;

import com.PrintLab.model.ProductCategory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class ProductAndServiceDto {
    private Long id;
    private String name;
    private String type;
    private String description;
    private Double cost;
    private Boolean status;
    private ProductCategory productCategory;
}

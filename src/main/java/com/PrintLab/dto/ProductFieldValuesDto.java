package com.PrintLab.dto;

import lombok.*;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class ProductFieldValuesDto {
    private Long id;
    private String name;
    private String status;
}

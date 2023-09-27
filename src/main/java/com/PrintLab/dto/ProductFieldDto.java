package com.PrintLab.dto;

import com.PrintLab.dto.projectEnums.Type;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class ProductFieldDto {
    private Long id;
    private String name;
    private String status;
    private LocalDate created_at;
    private Integer sequence;
    private Type type;

    private List<ProductFieldValuesDto> productFieldValuesList;

}

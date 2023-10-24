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
public class UpingDto
{
    private Long id;
    private String productSize;
    private String category;
    private Integer l1;
    private Integer l2;
    private String unit;
    private String mm;
    private String inch;
    private Boolean status;
    private List<UpingPaperSizeDto> upingPaperSize;
}

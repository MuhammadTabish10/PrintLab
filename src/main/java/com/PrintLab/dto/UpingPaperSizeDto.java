package com.PrintLab.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class UpingPaperSizeDto
{
    private Long id;
    private PaperSizeDto paperSize;
    private Integer value;
}

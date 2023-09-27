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
    private List<UpingPaperSizeDto> upingPaperSize;
}

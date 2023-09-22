package com.PrintLab.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PressMachineSizeDto {
    private Long id;
    private PaperSizeDto paperSize;
    private Long value;
}

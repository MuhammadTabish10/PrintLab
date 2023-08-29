package com.PrintLab.dto;

import com.PrintLab.modal.PressMachine;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Calculator
{
    private Long pressMachineId;
    private String productValue;
    private Long jobColorsFront;
    private String sizeValue;
    private String paper;
    private Integer gsm;
    private String sheetSizeValue;
    private String sideOptionValue;
    private Boolean impositionValue;
    private Long jobColorsBack;
}

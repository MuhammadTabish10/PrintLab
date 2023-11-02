package com.PrintLab.dto;

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
    private String category;
    private String inch;
    private String mm;
    private String paper;
    private Integer gsm;
    private Double quantity;
    private String sheetSizeValue;
    private String sideOptionValue;
    private Boolean impositionValue;
    private Long jobColorsBack;
    private Double margin;
    private Double setupFee;
    private Double cutting;
    private Double cuttingImpression;
}

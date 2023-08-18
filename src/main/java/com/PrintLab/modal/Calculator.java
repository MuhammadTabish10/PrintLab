package com.PrintLab.modal;

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
    private String selectedProductValue;
    private Long jobColorsFront;
    private String sizeValue;
    private String paper;
    private Long gsm;
    private String sheetSizeValue;
    private String sideOptionValue;
    private String impositionValue;
    private Long jobColorsBack;
}

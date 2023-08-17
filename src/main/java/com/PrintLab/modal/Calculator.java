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
    private String selectedPressMachine;
    private String selectedProductValue;
    private String jobColorsFront;
    private String sizeValue;
    private String selectedPaper;
    private String selectedGsm;
    private String selectedSheetSizeValue;
    private String sideOptionValue;
    private String impositionValue;
    private String jobColorsBack;
}

package com.PrintLab.service;

import com.PrintLab.dto.Calculator;

import java.util.Map;

public interface CalculatorService
{
    public Map<String, Double> CalculateMoq(Calculator calculator);
}

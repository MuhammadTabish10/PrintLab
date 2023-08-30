package com.PrintLab.controller;

import com.PrintLab.dto.Calculator;
import com.PrintLab.service.CalculatorService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping("/api")
public class CalculatorController {

    private final CalculatorService calculatorService;

    public CalculatorController(CalculatorService calculatorService) {
        this.calculatorService = calculatorService;
    }

    @PostMapping("/printlab-calculator")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Double> calculateMoq(@RequestBody Calculator calculator) {
        Double result = calculatorService.CalculateMoq(calculator);
        return ResponseEntity.ok(result);
    }
}

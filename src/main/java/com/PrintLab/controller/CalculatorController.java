package com.PrintLab.controller;

import com.PrintLab.modal.Calculator;
import com.PrintLab.service.CalculatorService;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<String> calculate(@RequestBody Calculator calculator) {
        String result = calculatorService.Calculate(calculator);
        return ResponseEntity.ok(result);
    }
}

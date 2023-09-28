package com.PrintLab.controller;


import com.PrintLab.dto.Calculator;
import com.PrintLab.model.Order;
import com.PrintLab.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
@RestController
@RequestMapping("/api")
public class AnalayticsController {
    @Autowired
    AnalyticsService analyticsService;

    @GetMapping("/printlab-count")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Map<String, Long>> getAllCount() {
        Map<String, Long> result = analyticsService.count();
        return ResponseEntity.ok(result);
    }
}
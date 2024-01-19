package com.PrintLab.controller;


import com.PrintLab.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
@RestController
@RequestMapping("/api")
public class AnalayticsController {
    @Autowired
    AnalyticsService analyticsService;

    @GetMapping("/printlab-count")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_PRODUCTION', 'ROLE_DESIGNER', 'ROLE_PLATE_SETTER')")
    public ResponseEntity<Map<String, Long>> getAllCount() {
        Map<String, Long> result = analyticsService.count();
        return ResponseEntity.ok(result);
    }
}
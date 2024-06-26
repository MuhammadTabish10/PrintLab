package com.PrintLab.controller;

import com.PrintLab.dto.JobProcessedDetailsDto;
import com.PrintLab.model.JobProcessedDetails;
import com.PrintLab.service.JobProcessedDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/job-details")
public class JobProcessDetailController {
    @Autowired
    JobProcessedDetailsService jobProcessedDetailsService;

    @GetMapping("/{id}")
    public ResponseEntity<JobProcessedDetailsDto> getJobDetailById(@PathVariable Long id) {
            return ResponseEntity.ok(jobProcessedDetailsService.getJobDetailById(id));
    }

    @GetMapping("/by-product/{id}")
    public ResponseEntity<List<JobProcessedDetailsDto>> getJobDetailByProductionId(@PathVariable Long id) {
        List<JobProcessedDetailsDto> jobDetailsDtoList = jobProcessedDetailsService.getJobDetailByProductRuleJobId(id);
        return ResponseEntity.ok(jobDetailsDtoList);
    }


    @PostMapping("/create")
    public ResponseEntity<JobProcessedDetailsDto> createJobDetail(@RequestBody JobProcessedDetailsDto jobDetailDTO) {
        return ResponseEntity.ok(jobProcessedDetailsService.createJobDetail(jobDetailDTO));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<JobProcessedDetailsDto> updateJobDetail(@PathVariable Long id, @RequestBody JobProcessedDetailsDto jobDetailDTO) {
            return ResponseEntity.ok(jobProcessedDetailsService.updateJobDetail(id, jobDetailDTO));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteJobDetail(@PathVariable Long id) {
        jobProcessedDetailsService.deleteJobDetail(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/all")
    public ResponseEntity<List<JobProcessedDetailsDto>> getAllJobDetails() {
        return ResponseEntity.ok(jobProcessedDetailsService.getAllJobDetails());
    }

    @GetMapping("/vendor/{vendor}")
    public ResponseEntity<List<JobProcessedDetailsDto>> getJobDetailsByVendor(@PathVariable String vendor) {
        List<JobProcessedDetailsDto> jobDetails = jobProcessedDetailsService.getJobDetailsByVendor(vendor);
        return ResponseEntity.ok(jobDetails);
    }

    @GetMapping("/vendor-by-date")
    public ResponseEntity<List<JobProcessedDetailsDto>> getJobDetailsByVendorAndDateRange(
            @RequestParam String vendor,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        List<JobProcessedDetailsDto> jobDetails = jobProcessedDetailsService.getJobDetailsByVendorAndDateRange(vendor, startDate, endDate);
        return ResponseEntity.ok(jobDetails);
    }

    @GetMapping("/order/{orderId}")
    public List<JobProcessedDetails> getJobProcessesByOrderId(@PathVariable Long orderId) {
        return jobProcessedDetailsService.getJobProcessesByOrderId(orderId);
    }
}

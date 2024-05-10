package com.PrintLab.controller;

import com.PrintLab.dto.JobProcessedDetailsDto;
import com.PrintLab.service.JobProcessedDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/job-details")
public class JobProcessDetailController {
    @Autowired
    JobProcessedDetailsService jobProcessedDetailsService;


    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_PRODUCTION')")
    public ResponseEntity<JobProcessedDetailsDto> getJobDetailById(@PathVariable Long id) {
            return ResponseEntity.ok(jobProcessedDetailsService.getJobDetailById(id));
    }

    @GetMapping("/by-production/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_PRODUCTION')")
    public ResponseEntity<List<JobProcessedDetailsDto>> getJobDetailByProductionId(@PathVariable Long id) {
        List<JobProcessedDetailsDto> jobDetailsDtoList = jobProcessedDetailsService.getJobDetailByProductionId(id);
        return ResponseEntity.ok(jobDetailsDtoList);
    }


    @PostMapping("/create")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_PRODUCTION')")
    public ResponseEntity<JobProcessedDetailsDto> createJobDetail(@RequestBody JobProcessedDetailsDto jobDetailDTO) {
        return ResponseEntity.ok(jobProcessedDetailsService.createJobDetail(jobDetailDTO));
    }

    @PutMapping("/update/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_PRODUCTION')")
    public ResponseEntity<JobProcessedDetailsDto> updateJobDetail(@PathVariable Long id, @RequestBody JobProcessedDetailsDto jobDetailDTO) {
            return ResponseEntity.ok(jobProcessedDetailsService.updateJobDetail(id, jobDetailDTO));
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_PRODUCTION')")
    public ResponseEntity<Void> deleteJobDetail(@PathVariable Long id) {
        jobProcessedDetailsService.deleteJobDetail(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/all")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_PRODUCTION')")
    public ResponseEntity<List<JobProcessedDetailsDto>> getAllJobDetails() {
        return ResponseEntity.ok(jobProcessedDetailsService.getAllJobDetails());
    }
}

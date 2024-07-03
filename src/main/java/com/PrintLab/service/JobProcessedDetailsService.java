package com.PrintLab.service;

import com.PrintLab.dto.JobProcessedDetailsDto;
import com.PrintLab.model.JobProcessedDetails;

import java.io.ByteArrayInputStream;
import java.time.LocalDate;
import java.util.List;

public interface JobProcessedDetailsService {
    JobProcessedDetailsDto getJobDetailById(Long id);

    JobProcessedDetailsDto createJobDetail(JobProcessedDetailsDto jobDetailDTO);

    JobProcessedDetailsDto updateJobDetail(Long id, JobProcessedDetailsDto jobDetailDTO);

    void deleteJobDetail(Long id);

    List<JobProcessedDetailsDto> getAllJobDetails();

    List<JobProcessedDetailsDto> getJobDetailByProductRuleJobId(Long id);

    List<JobProcessedDetailsDto> getJobDetailsByVendor(String vendor);

    List<JobProcessedDetailsDto> getJobDetailsByVendorAndDateRange(String vendor, LocalDate startDate, LocalDate endDate);

    List<JobProcessedDetails> getJobProcessesByOrderId(Long orderId);

    ByteArrayInputStream exportJobDetailsToExcel(List<JobProcessedDetailsDto> jobDetails);
}

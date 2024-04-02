package com.PrintLab.service;

import com.PrintLab.dto.JobProcessedDetailsDto;

import java.util.List;

public interface JobProcessedDetailsService {
    JobProcessedDetailsDto getJobDetailById(Long id);

    JobProcessedDetailsDto createJobDetail(JobProcessedDetailsDto jobDetailDTO);

    JobProcessedDetailsDto updateJobDetail(Long id, JobProcessedDetailsDto jobDetailDTO);

    void deleteJobDetail(Long id);

    List<JobProcessedDetailsDto> getAllJobDetails();

    List<JobProcessedDetailsDto> getJobDetailByProductionId(Long id);
}

package com.PrintLab.service.impl;

import com.PrintLab.Mapper.JobProcessedDetailsMapper;
import com.PrintLab.dto.JobProcessedDetailsDto;
import com.PrintLab.exception.RecordNotFoundException;
import com.PrintLab.model.JobProcessedDetails;
import com.PrintLab.repository.JobProcessedDetailsRepository;
import com.PrintLab.service.JobProcessedDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class JobProcessDetailServiceImpl implements JobProcessedDetailsService {

    private final JobProcessedDetailsRepository jobProcessedDetailsRepository;
    private final JobProcessedDetailsMapper jobProcessedDetailsMapper;

    @Autowired
    public JobProcessDetailServiceImpl(JobProcessedDetailsRepository jobProcessedDetailsRepository, JobProcessedDetailsMapper jobProcessedDetailsMapper) {
        this.jobProcessedDetailsRepository = jobProcessedDetailsRepository;
        this.jobProcessedDetailsMapper = jobProcessedDetailsMapper;
    }

    @Override
    public JobProcessedDetailsDto getJobDetailById(Long id) {
        return jobProcessedDetailsRepository.findById(id)
                .map(jobProcessedDetailsMapper::toDto)
                .orElseThrow(() -> new EntityNotFoundException("Job detail with ID " + id + " not found"));
    }

    @Override
    public JobProcessedDetailsDto createJobDetail(JobProcessedDetailsDto jobDetailDTO) {
        JobProcessedDetails jobDetail = jobProcessedDetailsMapper.toEntity(jobDetailDTO);
        jobDetail = jobProcessedDetailsRepository.save(jobDetail);
        return jobProcessedDetailsMapper.toDto(jobDetail);
    }

    @Override
    public JobProcessedDetailsDto updateJobDetail(Long id, JobProcessedDetailsDto jobDetailDTO) {
        return jobProcessedDetailsRepository.findById(id)
                .map(existingJobDetail -> {
                    JobProcessedDetails updatedJobDetail = jobProcessedDetailsMapper.toEntity(jobDetailDTO);
                    updatedJobDetail.setId(id);
                    updatedJobDetail = jobProcessedDetailsRepository.save(updatedJobDetail);
                    return jobProcessedDetailsMapper.toDto(updatedJobDetail);
                })
                .orElseThrow(() -> new EntityNotFoundException("Job detail with ID " + id + " not found"));
    }

    @Override
    public void deleteJobDetail(Long id) {
        if (!jobProcessedDetailsRepository.existsById(id)) {
            throw new EntityNotFoundException("Job detail with ID " + id + " not found");
        }
        jobProcessedDetailsRepository.deleteById(id);
    }

    @Override
    public List<JobProcessedDetailsDto> getAllJobDetails() {
        List<JobProcessedDetails> allJobDetails = jobProcessedDetailsRepository.findAll();
        return allJobDetails.stream()
                .map(jobProcessedDetailsMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<JobProcessedDetailsDto> getJobDetailByProductionId(Long id) {
        List<JobProcessedDetails> jobDetailsList = jobProcessedDetailsRepository.findByProductionJobIdAndJobProcessedIsTrue(id);
        if (jobDetailsList.isEmpty()) {
            throw new RecordNotFoundException(String.format("No job details found for production job ID %d", id));
        }
        return jobDetailsList.stream()
                .map(jobProcessedDetailsMapper::toDto)
                .collect(Collectors.toList());
    }


}

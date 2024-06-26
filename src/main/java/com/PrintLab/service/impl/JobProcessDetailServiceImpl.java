package com.PrintLab.service.impl;

import com.PrintLab.Mapper.JobProcessedDetailsMapper;
import com.PrintLab.dto.JobProcessedDetailsDto;
import com.PrintLab.dto.VendorSettlementDto;
import com.PrintLab.exception.RecordNotFoundException;
import com.PrintLab.model.JobProcessedDetails;
import com.PrintLab.model.Order;
import com.PrintLab.model.Vendor;
import com.PrintLab.model.VendorSettlement;
import com.PrintLab.repository.JobProcessedDetailsRepository;
import com.PrintLab.repository.OrderRepository;
import com.PrintLab.repository.VendorRepository;
import com.PrintLab.service.JobProcessedDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class JobProcessDetailServiceImpl implements JobProcessedDetailsService {

    private final JobProcessedDetailsRepository jobProcessedDetailsRepository;
    private final JobProcessedDetailsMapper jobProcessedDetailsMapper;

    private final OrderRepository orderRepository;

    @Autowired
    public JobProcessDetailServiceImpl(JobProcessedDetailsRepository jobProcessedDetailsRepository, JobProcessedDetailsMapper jobProcessedDetailsMapper, OrderRepository orderRepository) {
        this.jobProcessedDetailsRepository = jobProcessedDetailsRepository;
        this.jobProcessedDetailsMapper = jobProcessedDetailsMapper;
        this.orderRepository = orderRepository;
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

        if(jobDetail.getOrder() != null){
            Long orderId = jobDetail.getOrder().getId();

            Order order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new RecordNotFoundException("Order not found at id: " + orderId));

            jobDetail.setOrder(order);
        }

        jobDetail = jobProcessedDetailsRepository.save(jobDetail);
        return jobProcessedDetailsMapper.toDto(jobDetail);
    }

    @Override
    public JobProcessedDetailsDto updateJobDetail(Long id, JobProcessedDetailsDto jobDetailDTO) {
        return jobProcessedDetailsRepository.findById(id)
                .map(existingJobDetail -> {
                    JobProcessedDetails updatedJobDetail = jobProcessedDetailsMapper.toEntity(jobDetailDTO);
                    updatedJobDetail.setId(id);

                    // Set the order entity if present in the DTO
                    if (jobDetailDTO.getOrder() != null && jobDetailDTO.getOrder().getId() != null) {
                        Long orderId = jobDetailDTO.getOrder().getId();

                        Order order = orderRepository.findById(orderId)
                                .orElseThrow(() -> new RecordNotFoundException("Order not found at id: " + orderId));

                        updatedJobDetail.setOrder(order);
                    }

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
    public List<JobProcessedDetailsDto> getJobDetailByProductRuleJobId(Long id) {
        List<JobProcessedDetails> jobDetailsList = jobProcessedDetailsRepository.findByProductRuleIdAndJobProcessedIsTrue(id);
        if (jobDetailsList.isEmpty()) {
            throw new RecordNotFoundException(String.format("No job details found for product job ID %d", id));
        }
        return jobDetailsList.stream()
                .map(jobProcessedDetailsMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<JobProcessedDetailsDto> getJobDetailsByVendor(String vendor) {
        List<JobProcessedDetails> jobDetailsList = jobProcessedDetailsRepository.findByVendor(vendor);
        if (jobDetailsList.isEmpty()) {
            throw new RecordNotFoundException(String.format("No job details found for vendor %s", vendor));
        }
        return jobDetailsList.stream()
                .map(jobProcessedDetailsMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<JobProcessedDetailsDto> getJobDetailsByVendorAndDateRange(String vendor, LocalDate startDate, LocalDate endDate) {
        List<JobProcessedDetails> jobDetails = jobProcessedDetailsRepository.findByVendorAndDateRange(vendor, startDate, endDate);
        return jobDetails.stream()
                .map(jobProcessedDetailsMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<JobProcessedDetails> getJobProcessesByOrderId(Long orderId) {
        return jobProcessedDetailsRepository.findByOrderIdAndPaymentIn(orderId, Arrays.asList("cash", "credit"));
    }


}

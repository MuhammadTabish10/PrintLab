package com.PrintLab.Mapper;

import com.PrintLab.dto.JobProcessedDetailsDto;
import com.PrintLab.model.JobProcessedDetails;
import org.springframework.stereotype.Component;

@Component
public class JobProcessedDetailsMapper {

    public JobProcessedDetailsDto toDto(JobProcessedDetails entity) {
        return JobProcessedDetailsDto.builder()
                .id(entity.getId())
                .amount(entity.getAmount())
                .vendor(entity.getVendor())
                .payment(entity.getPayment())
                .description(entity.getDescription())
                .status(entity.isStatus())
                .jobProcessed(entity.isJobProcessed())
                .processName(entity.getProcessName())
                .timeStamp(entity.getTimeStamp())
                .build();
    }

    public JobProcessedDetails toEntity(JobProcessedDetailsDto dto) {
        JobProcessedDetails entity = new JobProcessedDetails();
        entity.setId(dto.getId());
        entity.setAmount(dto.getAmount());
        entity.setVendor(dto.getVendor());
        entity.setPayment(dto.getPayment());
        entity.setDescription(dto.getDescription());
        entity.setStatus(dto.isStatus());
        entity.setJobProcessed(dto.isJobProcessed());
        entity.setProcessName(dto.getProcessName());
        entity.setTimeStamp(dto.getTimeStamp());
        return entity;
    }
}

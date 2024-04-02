package com.PrintLab.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class JobProcessedDetailsDto {
    private Long id;

    private Double amount;

    private String vendor;

    private String payment;

    private boolean status;

    private boolean jobProcessed;

    private String processName;

    private LocalDateTime timeStamp;

}

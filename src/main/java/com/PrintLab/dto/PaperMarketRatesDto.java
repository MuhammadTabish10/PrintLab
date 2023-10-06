package com.PrintLab.dto;

import com.PrintLab.model.Vendor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class PaperMarketRatesDto
{
    private Long id;
    private LocalDateTime timeStamp;
    private String paperStock;
    private String brand;
    private String madeIn;
    private Integer GSM;
    private Double length;
    private Double width;
    private String dimension;
    private Integer qty;
    private Double kg;
    private String recordType;
    private Double ratePkr;
    private Boolean verified;
    private String notes;
    private String status;
    private Vendor vendor;
}

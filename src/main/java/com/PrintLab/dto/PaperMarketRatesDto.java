package com.PrintLab.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class PaperMarketRatesDto
{
    private Long id;
    private LocalDate date;
    private String paperStock;
    private Integer GSM;
    private Double length;
    private Double width;
    private String dimension;
    private Integer qty;
    private Double ratePkr;
    private Boolean verified;
}

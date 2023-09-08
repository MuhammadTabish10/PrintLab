package com.PrintLab.modal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDate;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "paper_market_rates")
public class PaperMarketRates
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDate timeStamp;
    private String paperStock;
    private String brand;
    private String madeIn;
    private Integer GSM;
    private Double length;
    private Double width;
    private String dimension;
    private Integer qty;
    private Double kg;
    private String vendor;
    private String recordType;
    private Double ratePkr;
    private Boolean verified;
    private String notes;
    private String status;
}

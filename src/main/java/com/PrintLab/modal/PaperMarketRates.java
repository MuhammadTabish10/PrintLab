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

package com.PrintLab.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class InvoiceProductDto {
    private Long id;
    private Date dateRow;
    private String productRow;
    private String description;
    private Integer qty;
    private Double rate;
    private Double amount;
    private Boolean status;
}

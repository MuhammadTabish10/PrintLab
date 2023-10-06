package com.PrintLab.dto;

import com.PrintLab.model.Vendor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class InventoryDto
{
    private Long id;
    private LocalDate created_at;
    private String paperStock;
    private String availableGsm;
    private String availableSizes;
    private Integer qty;
    private String madeIn;
    private String brandName;
    private LocalDate dateUpdated;
    private Double rate;
    private String status;
    private Double oldRate;
    private Vendor vendor;
}

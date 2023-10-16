package com.PrintLab.dto;

import com.PrintLab.model.ProductRule;
import com.PrintLab.model.Vendor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class ProductRulePaperStockDto {
    private Long id;
    private String paperStock;
    private String brand;
    private String madeIn;
    private String dimension;
    private String gsm;
    private Boolean status;
    private Vendor vendor;
}

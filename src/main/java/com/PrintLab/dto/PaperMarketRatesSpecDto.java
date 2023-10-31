package com.PrintLab.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.List;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class PaperMarketRatesSpecDto {
    private String paperStock;
    private Long vendorId;
    private String brand;
    private String madeIn;
    private String dimension;
    private List<Integer> gsm;
}

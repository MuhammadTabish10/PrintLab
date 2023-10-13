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
    @NotBlank(message = "Paper stock must not be blank")
    private String paperStock;

    @NotNull(message = "Vendor ID must not be null")
    private Long vendorId;

    @NotBlank(message = "Brand must not be blank")
    private String brand;

    @NotBlank(message = "Made in must not be blank")
    private String madeIn;

    @NotBlank(message = "Dimension must not be blank")
    private String dimension;

    @NotNull(message = "GSM list must not be null")
    @Size(min = 1, message = "GSM list must contain at least one value")
    private List<Integer> gsm;
}

package com.PrintLab.dto;

import com.PrintLab.modal.Vendor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class CtpDto {
    private Long id;
    private LocalDate date;
    private Integer l1;
    private Integer l2;
    private String plateDimension;
    private Integer rate;
    private Vendor vendor;
}

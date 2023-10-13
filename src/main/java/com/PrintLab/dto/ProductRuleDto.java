package com.PrintLab.dto;

import com.PrintLab.model.Ctp;
import com.PrintLab.model.PressMachine;
import com.PrintLab.model.Vendor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class ProductRuleDto {
    private Long id;
    private String paperStock;
    private String brand;
    private String madeIn;
    private String dimension;
    private String gsm;
    private Boolean status;
    private Vendor vendor;
    private PressMachine pressMachine;
    private Ctp ctp;
}
//rule many to one
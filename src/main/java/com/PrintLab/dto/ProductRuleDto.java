package com.PrintLab.dto;

import com.PrintLab.model.Ctp;
import com.PrintLab.model.PressMachine;
import com.PrintLab.model.ProductRulePaperStock;
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
    private String title;
    private PressMachine pressMachine;
    private Ctp ctp;
    private List<ProductRulePaperStockDto> productRulePaperStockList;
}
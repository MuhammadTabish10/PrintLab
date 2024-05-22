package com.PrintLab.dto;

import com.PrintLab.model.Ctp;
import com.PrintLab.model.PressMachine;
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
    private String productName;
    private String printSide;
    private String jobColorFront;
    private String jobColorBack;
    private String sizeCategory;
    private String size;
    private String quantity;
    private Boolean impositionValue;
    private String status;
    private PressMachine pressMachine;
    private Ctp ctp;
    private String businessCategory;
    private List<BusinessUnitProcessDto> processList;
    private List<JobProcessedDetailsDto> processedDetailList;
    private List<ProductRulePaperStockDto> productRulePaperStockList;
    private String type;
    private List<RoleDto> visibleTo;
    private Boolean groupSheet;
    private Boolean predefined;
    private Boolean custom;
    private Integer up;
    private Long groupSheetOf;
}
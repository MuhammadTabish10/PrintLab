package com.PrintLab.dto;

import com.PrintLab.model.ProductionJob;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BusinessDto {
    private Long id;
    private String businessName;
    private List<BusinessBranchDto> businessBranchList;
    private CustomerDto customer;
    private List<ProductionJob> productionJobs;
}

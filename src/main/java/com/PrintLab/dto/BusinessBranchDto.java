package com.PrintLab.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BusinessBranchDto {
    private Long id;
    private String branchName;
    private String address;
    private String city;
    private String pointOfContact;
    private String phoneNumber;
}

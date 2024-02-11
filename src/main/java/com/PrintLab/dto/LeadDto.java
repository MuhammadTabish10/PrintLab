package com.PrintLab.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class LeadDto {
    private Long id;
    private String companyName;
    private String contactName;
    private LocalDateTime createdAt;
    private boolean status;
    private String leadStatusType;
    private List<LeadAddressDto> leadAddress;
    private LeadAboutDto about;
    private List<LeadContactDto> contact;
}

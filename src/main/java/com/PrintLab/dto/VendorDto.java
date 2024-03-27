package com.PrintLab.dto;

import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class VendorDto
{
    private Long id;
    private String name;
    private LocalDate date;
    private String contactName;
    private String contactNumber;
    private String email;
    private String address;
    private String notes;
    private Boolean status;

    private List<VendorProcessDto> vendorProcessList;

    @ToString.Exclude
    private List<BusinessUnitProcessDto> businessUnitProcess;
}

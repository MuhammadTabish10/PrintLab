package com.PrintLab.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class LeadAddressDto {
    private Long id;
    private String type;
    private String address;
    private String city;
    private String state;
    private String postalCode;
    private String country;
}

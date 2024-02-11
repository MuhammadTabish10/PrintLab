package com.PrintLab.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class LeadContactDto {
    private Long id;
    private String name;
    private String jobTitle;
    private String role;
    private String landLine;
    private String website;
    private String mobile;
    private String email;
}

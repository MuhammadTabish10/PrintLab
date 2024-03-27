package com.PrintLab.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerDto {
    private Long id;
    private String name;
    private String email;
    private String whatsApp;
    private String mobileNo;
    private String statusId;
    private Date since;
    private String leadOwner;
    private boolean clientStatus;
    private List<BusinessDto> customerBusinessName;
    private LocalDate createdAt;
    private String clientPreferred;
    private String primaryPaymentMethod;
    private String terms;
    private String tax;
    private String notes;
    private boolean showLead;
    private String status;
}

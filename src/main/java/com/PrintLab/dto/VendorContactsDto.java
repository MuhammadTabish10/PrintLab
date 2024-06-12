package com.PrintLab.dto;

import com.PrintLab.model.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class VendorContactsDto {
    private Long id;
    private String name;
    private String designation;
    private String whatsapp;
    private String phone;
    private User addedBy;
    private Boolean status;
    private Boolean isVerified;
    private Boolean isLock;
    private VendorDto vendor;
}

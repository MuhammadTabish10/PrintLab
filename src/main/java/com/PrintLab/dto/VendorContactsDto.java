package com.PrintLab.dto;

import com.PrintLab.model.User;
import com.PrintLab.model.Vendor;
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
    private String addedBy;
    private User user;
    private Boolean status;
    private Boolean isActive;
    private Boolean isVerified;
    private Boolean isLock;
    private VendorDto vendor;
}

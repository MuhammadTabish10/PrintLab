package com.PrintLab.dto;

import com.PrintLab.model.User;
import com.PrintLab.model.VendorContacts;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
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

    private List<UserDto> productionUserList;


    private List<BusinessUnitProcessDto> businessUnitProcess;

    private Double due;
    private String secondaryEmail;
    private String landmark;
    private String city;
    private String market;
    private Boolean isLock;
    private Boolean isActive;
    private Boolean isVerified;
    private Integer rating;
    private LocalDate since;
    private User user;
    private LocalDateTime timeStamp;
    private String addedBy;

    private List<VendorContactsDto> vendorContacts;
}

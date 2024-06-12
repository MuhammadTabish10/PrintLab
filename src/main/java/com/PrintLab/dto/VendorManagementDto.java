package com.PrintLab.dto;

import com.PrintLab.model.User;
import com.PrintLab.model.Vendor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import java.time.LocalDateTime;
import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class VendorManagementDto {
    private Long id;
    private Boolean isLock;
    private Boolean isActive;
    private Boolean isVerified;
    private Integer rating;
    private Date since;
    private User user;
    private LocalDateTime timeStamp;
    private Vendor vendor;
}

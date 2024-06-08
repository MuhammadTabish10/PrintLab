package com.PrintLab.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
public class VendorManagement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Boolean isLock;
    private Boolean isActive;
    private Boolean isVerified;
    private Integer rating;
    private Date since;

    @JsonIgnore
    @OneToOne
    @JoinColumn(name = "user_id")
    @ToString.Exclude
    private User user;
    private LocalDateTime timeStamp;

    @JsonIgnore
    @OneToOne
    @JoinColumn(name = "vendor_id")
    @ToString.Exclude
    private Vendor vendor;
}

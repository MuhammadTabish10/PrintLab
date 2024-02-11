package com.PrintLab.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Builder
public class Leads {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String companyName;
    private String contactName;
    private LocalDateTime createdAt;
    private boolean status;
    private String leadStatusType;
    @OneToMany(mappedBy = "leads", cascade = CascadeType.ALL)
    private List<LeadsAddress> leadAddress;
    @Embedded
    private LeadsAbout about;
    @OneToMany(mappedBy = "leads", cascade = CascadeType.ALL)
    private List<LeadsContact> contact;
}

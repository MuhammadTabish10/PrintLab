package com.PrintLab.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.List;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "vendor")
public class Vendor
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;

    @CreationTimestamp
    private LocalDate date;

    private String contactName;
    private String contactNumber;
    private String email;
    private String address;
    private String notes;
    private Boolean status;

    @OneToMany(mappedBy = "vendor", cascade = CascadeType.ALL)
    private List<VendorProcess> vendorProcessList;
}

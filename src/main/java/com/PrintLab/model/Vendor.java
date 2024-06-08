package com.PrintLab.model;


import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
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
public class Vendor {
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
    @Column(columnDefinition = "TEXT")
    private String notes;
    private Boolean status;

    @OneToMany(mappedBy = "vendor", cascade = CascadeType.ALL)
    private List<VendorProcess> vendorProcessList;

    @OneToMany(mappedBy = "vendor", cascade = CascadeType.ALL)
    private List<User> productionUserList;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "vendor_business_unit_process",
            joinColumns = @JoinColumn(name = "vendor_id"),
            inverseJoinColumns = @JoinColumn(name = "business_unit_process_id")
    )
    private List<BusinessUnitProcess> businessUnitProcesses;

    private Double due;
    private String secondaryEmail;
    private String landmark;

    @OneToMany(mappedBy = "vendor", cascade = CascadeType.ALL)
    @ToString.Exclude
    @JsonIgnore
    private List<VendorContacts> vendorContacts;

    @OneToOne(mappedBy = "vendor", cascade = CascadeType.ALL)
    @ToString.Exclude
    @JsonIgnore
    private VendorManagement vendorManagement;
}

package com.PrintLab.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import javax.persistence.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
public class VendorContacts {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String designation;
    private String whatsapp;
    private String phone;

    @JsonIgnore
    @OneToOne
    @JoinColumn(name = "user_id")
    @ToString.Exclude
    private User user;
    private Boolean status;
    private Boolean isActive;
    private Boolean isVerified;

    @ManyToOne
    @JoinColumn(name = "vendor_id")
    @ToString.Exclude
    @JsonIgnore
    private Vendor vendor;
}

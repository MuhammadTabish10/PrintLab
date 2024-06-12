package com.PrintLab.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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

    @ManyToOne
    @JoinColumn(name = "added_by_user_id")
    private User addedBy;

    private Boolean status;
    private Boolean isVerified;
    private Boolean isLock;

    @ManyToOne
    @JoinColumn(name = "vendor_id")
    private Vendor vendor;
}

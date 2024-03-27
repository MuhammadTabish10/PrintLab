package com.PrintLab.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "customer")
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String email;
    private String whatsApp;
    private String mobileNo;
    private String statusId;
    private Date since;
    private String leadOwner;
    private boolean clientStatus;
    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL)
    private List<Business> customerBusinessName;
    private String clientPreferred;
    @Column(columnDefinition = "TEXT")
    private String primaryPaymentMethod;
    private String terms;
    private String tax;
    private String notes;
    private String status;
    private boolean showLead;
    @CreationTimestamp
    private LocalDate createdAt;
}

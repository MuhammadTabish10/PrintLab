package com.PrintLab.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import java.time.LocalDate;

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
    private String title;
    private String name;
    private String middleName;
    private String lastName;
    private String email;
    private String phoneNo;
    private String website;
    @CreationTimestamp
    private LocalDate createdAt;
    private String businessName;
    private boolean isSubCustomer;
    private boolean billParentCustomer;
    private Long parentCustomerId;
    private String billingStreetAddress;
    private String billingCity;
    private String billingProvince;
    private String billingPostalCode;
    private String billingCountry;
    private boolean sameAsBilling;
    private String shippingStreetAddress;
    private String shippingCity;
    private String shippingProvince;
    private String shippingPostalCode;
    private String shippingCountry;
    private String openingBalance;
    private LocalDate asOf;
    private String primaryPaymentMethod;
    private String terms;
    private String tax;
    private String status;
}

package com.PrintLab.model;

import lombok.*;

import javax.persistence.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Builder
public class LeadsAddress {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String type;
    @Column(columnDefinition = "TEXT")
    private String address;
    private String city;
    private String state;
    private String postalCode;
    private String country;
    @ManyToOne
    @JoinColumn(name = "leads_id")
    @ToString.Exclude
    private Leads leads;
}

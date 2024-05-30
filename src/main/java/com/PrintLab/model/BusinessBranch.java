package com.PrintLab.model;

import lombok.*;

import javax.persistence.*;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BusinessBranch {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String branchName;
    private String address;
    private String city;
    private String pointOfContact;
    private String phoneNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "business_id")
    @ToString.Exclude
    private Business business;

    @ManyToMany(mappedBy = "businessBranch")
    @ToString.Exclude
    private List<OrderPaymentHistory> orderPaymentHistoryList;
}

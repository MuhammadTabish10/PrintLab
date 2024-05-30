package com.PrintLab.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import javax.persistence.*;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Business {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String businessName;

    @OneToMany(mappedBy = "business", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    private List<BusinessBranch> businessBranchList;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    @ToString.Exclude
    private Customer customer;

    @ManyToMany(mappedBy = "businesses")
    @ToString.Exclude
    @JsonIgnore
    private List<Order> orders;

    @ManyToMany(mappedBy = "business")
    @ToString.Exclude
    private List<OrderPaymentHistory> orderPaymentHistoryList;
}

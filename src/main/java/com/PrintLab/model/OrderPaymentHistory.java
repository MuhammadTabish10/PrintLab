package com.PrintLab.model;

import lombok.*;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
public class OrderPaymentHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDateTime timeStamp;
    private Double amount;
    @ManyToMany
    @JoinTable(
            name = "payment_history_business",
            joinColumns = @JoinColumn(name = "payment_history_id"),
            inverseJoinColumns = @JoinColumn(name = "business_id")
    )
    @ToString.Exclude
    private List<Business> business;

    @ManyToMany
    @JoinTable(
            name = "payment_history_businessBranch",
            joinColumns = @JoinColumn(name = "payment_history_id"),
            inverseJoinColumns = @JoinColumn(name = "businessBranch_id")
    )
    @ToString.Exclude
    private List<BusinessBranch> businessBranch;

    @ManyToMany
    @JoinTable(
            name = "payment_history_user",
            joinColumns = @JoinColumn(name = "payment_history_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    @ToString.Exclude
    private List<User> paymentReceivedBy;
    @Column(columnDefinition = "TEXT")
    private String description;
    private String type;
    private Boolean status;

    @OneToOne(mappedBy = "paymentHistory", cascade = CascadeType.ALL)
    private MasterCustomerStatement masterCustomerStatement;

    @ManyToOne
    @JoinColumn(name = "order_id")
    @ToString.Exclude
    private Order order;
}

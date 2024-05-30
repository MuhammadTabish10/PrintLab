package com.PrintLab.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
public class MasterCustomerStatement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDate date;
    private LocalTime time;
    private String description;
    private Double debit;
    private Double credit;
    private Double balance;
    @JsonIgnore
    @OneToOne
    @JoinColumn(name = "orderPayment_id")
    private OrderPaymentHistory paymentHistory;
    @JsonIgnore
    @OneToOne
    @JoinColumn(name = "order_id")
    @ToString.Exclude
    private Order order;
}

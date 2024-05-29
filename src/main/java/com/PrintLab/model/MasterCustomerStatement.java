package com.PrintLab.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
public class MasterCustomerStatement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDate localDate;
    private LocalTime localTime;
    private String description;
    @JsonIgnore
    @OneToOne
    @JoinColumn(name = "order_id")
    private Order order;
    private Double debit;
    private Double credit;
    private Double amount;
    @JsonIgnore
    @OneToOne
    @JoinColumn(name = "orderPayment_id")
    private OrderPaymentHistory paymentHistory;
}

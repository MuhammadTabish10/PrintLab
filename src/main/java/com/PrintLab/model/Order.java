package com.PrintLab.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "orders")
public class Order
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String product;
    private String paper;
    private String size;
    private String category;
    private Double gsm;
    private Double quantity;
    private Double price;
    private Long jobColorsFront;
    private String sideOptionValue;
    private Boolean impositionValue;
    private Long jobColorsBack;
    private Boolean providedDesign;
    private String url;
    private Long productRule;
    private Boolean status;
    private Boolean ctpProcess;
    private Boolean pressMachineProcess;
    private Boolean paperMarketProcess;
    private Boolean isRejected;

    @ManyToOne()
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @ManyToOne()
    @JoinColumn(name = "user_designer_id")
    private User designer;

    @ManyToOne()
    @JoinColumn(name = "user_production_id")
    private User production;

    @ManyToOne()
    @JoinColumn(name = "user_plate_setter_id")
    private User plateSetter;
}

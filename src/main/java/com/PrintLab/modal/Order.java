package com.PrintLab.modal;

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
    private String size;
    private Double gsm;
    private Double quantity;
    private Double price;
    private Boolean providedDesign;
    private String url;

    @ManyToOne()
    @JoinColumn(name = "customer_id")
    private Customer customer;
}

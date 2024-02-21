package com.PrintLab.model;

import lombok.*;

import javax.persistence.*;
import java.util.Date;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
public class InvoiceProduct {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Date dateRow;
    private Long productRow;
    private String productName;
    private String type;
    private String description;
    private Integer qty;
    private Double rate;
    private Double amount;
    private Boolean status;
    @ManyToOne
    @JoinColumn(name = "invoice_id")
    @ToString.Exclude
    private Invoice invoice;

}

package com.PrintLab.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
public class Invoice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true)
    private Long invoiceNo;
    private Long customer;
    private String customerEmail;
    private String business;
    private Boolean sendLater;
    private String billingAddress;
    private Double balanceDue;
    private String terms;
    private Date invoiceDate;
    private Date dueDate;
    @OneToMany(mappedBy = "invoice", cascade = CascadeType.ALL)
    private List<InvoiceProduct> invoiceProduct;
    private String message;
    private String statement;
    private Boolean status;

}

package com.PrintLab.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String product;
    private String paper;
    @Column(columnDefinition = "TEXT")
    private String size;
    private String sizeCategory;
    private Double gsm;
    private Double quantity;
    private Double rate;
    private Long jobColorsFront;
    private String sideOptionValue;
    private Boolean impositionValue;
    private Long jobColorsBack;
    private Boolean providedDesign;
    private String url;
    private Long productRule;
    private String status;
    private Boolean ctpProcess;
    private Boolean pressMachineProcess;
    private Boolean paperMarketProcess;
    private Boolean isRejected;
    private LocalDateTime timeStamp;

    @ManyToOne()
    @ToString.Exclude
    private User assignedBy;

    @ManyToOne()
    @ToString.Exclude
    private User createdBy;

    @ManyToOne()
    @JoinColumn(name = "customer_id")
    @ToString.Exclude
    private Customer customer;

    @ManyToOne()
    @JoinColumn(name = "user_designer_id")
    @ToString.Exclude
    private User designer;

    @ManyToOne()
    @JoinColumn(name = "user_production_id")
    @ToString.Exclude
    private User production;

    @ManyToOne()
    @JoinColumn(name = "user_plate_setter_id")
    @ToString.Exclude
    private User plateSetter;

    private String type;
    private String businessCategory;

    @ManyToMany
    @JoinTable(
            name = "production_job_business",
            joinColumns = @JoinColumn(name = "production_job_id"),
            inverseJoinColumns = @JoinColumn(name = "business_id")
    )
    @ToString.Exclude
    private List<Business> businesses;

    private String productionUser;
    private Long titleId;
    private String jobId;
    private String productCategory;

    @Column(columnDefinition = "TEXT")
    private String description;
    private Double amount;
    private String linkedInvoice;

    @Column(columnDefinition = "TEXT")
    private String privateNotes;

    @Column(columnDefinition = "TEXT")
    private String orderTrackingNotes;

    @Column(columnDefinition = "TEXT")
    private String productionNotes;

    private String ctpFileName;
    private String locationOfFile;
    private Date sentOn;
    private String designPackageFile;
    private String locationOfDesignFile;
    private Date jobStartDate;
    private Date productionStartDate;
    private Date productionEndDate;
    private Date packingAndQADate;
    private Date deliveryDate;
    private Date expiryDate;
    private String sendTo;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    @ToString.Exclude
    @JsonIgnore
    private List<OrderItems> orderItems;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    @ToString.Exclude
    @JsonIgnore
    private List<OrderPaymentHistory> orderPaymentHistory;

    @ManyToMany
    @JoinTable(
            name = "order_master_customer_statement",
            joinColumns = @JoinColumn(name = "order_id"),
            inverseJoinColumns = @JoinColumn(name = "master_customer_statement_id")
    )
    @ToString.Exclude
    @JsonIgnore
    private List<MasterCustomerStatement> masterCustomerStatements;
}

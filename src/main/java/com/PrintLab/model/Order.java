package com.PrintLab.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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
public class Order
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String product;
    private String paper;
    @Column(columnDefinition = "TEXT")
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
    private String status;
    private Boolean ctpProcess;
    private Boolean pressMachineProcess;
    private Boolean paperMarketProcess;
    private Boolean isRejected;
    private LocalDateTime timeStamp;
    @ManyToOne()
    private User assignedBy;

    @ManyToOne()
    private User createdBy;

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
    private String type;
    private String businessCategory;
    @ManyToMany
    @JoinTable(
            name = "production_job_business",
            joinColumns = @JoinColumn(name = "production_job_id"),
            inverseJoinColumns = @JoinColumn(name = "business_id")
    )
    private List<Business> businesses;
    private String productionUser;
    private Long titleId;
    private String jobId;
    private String productCategory;
    @Column(columnDefinition = "TEXT")
    private String description;
    private Integer qty;
    private Integer rate;
    private Integer amount;
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
}

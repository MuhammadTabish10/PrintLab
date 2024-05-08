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
public class ProductionJob {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne()
    @JoinColumn(name = "customer_id")
    private Customer client;
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
    private String productName;
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
//    @OneToMany(mappedBy = "productionJob", cascade = CascadeType.ALL)
//    private List<Proof> proof;
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
    @OneToMany(mappedBy = "productionJob", cascade = CascadeType.ALL)
    private List<JobProcessedDetails> processedDetailList;
    private String sizeCategory;
    private String size;
    private LocalDateTime timeStamp;
    @ManyToOne()
    private User assignedBy;

    @ManyToOne()
    private User createdBy;
    @ManyToOne()
    @JoinColumn(name = "user_designer_id")
    private User designer;

    @ManyToOne()
    @JoinColumn(name = "user_production_id")
    private User production;

    @ManyToOne()
    @JoinColumn(name = "user_plate_setter_id")
    private User plateSetter;

    private String status;
    private String type;
}

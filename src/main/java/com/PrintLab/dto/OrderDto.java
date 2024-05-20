package com.PrintLab.dto;

import com.PrintLab.model.Customer;
import com.PrintLab.model.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class OrderDto 
{
    private Long id;
    private String product;
    private String paper;
    private String category;
    private String size;
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
    private String type;
    private Boolean ctpProcess;
    private Boolean pressMachineProcess;
    private Boolean paperMarketProcess;
    private User designer;
    private User production;
    private User plateSetter;
    private Boolean isRejected;
    private LocalDateTime timeStamp;
    private User createdBy;
    private User assignedBy;
    private Customer customer;
    private String businessCategory;
    private List<BusinessDto> businesses;
    private String productionUser;
    private Long titleId;
    private String jobId;
    private String productCategory;
    private String description;
    private Integer qty;
    private Integer rate;
    private Integer amount;
    private String linkedInvoice;
    private String privateNotes;
    private String orderTrackingNotes;
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

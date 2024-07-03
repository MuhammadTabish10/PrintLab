package com.PrintLab.dto;

import com.PrintLab.model.Customer;
import com.PrintLab.model.ProductRule;
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
    private User assignedBy;
    private User createdBy;
    private Customer customer;
    private User designer;
    private User production;
    private User plateSetter;
    private String type;
    private String businessCategory;
    private List<BusinessDto> businesses;
    private String productionUser;
    private Long titleId;
    private String jobId;
    private String productCategory;
    private String description;
    private Double amount;
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
    private List<OrderItemsDto> orderItems;
    private Long productRuleId;
    private String category;
}

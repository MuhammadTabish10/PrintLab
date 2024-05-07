package com.PrintLab.dto;

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
public class ProductionJobDto {
    private Long id;
    private String client;
    private String businessCategory;
    private String productionUser;
    private List<BusinessDto>businessName;
    private List<BusinessUnitProcessDto> processList;

    // Add the missing attributes here
    private String jobId;
    private String productCategory;
    private String productName;
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
    private List<ProofDto> proof;
    private String sendTo;
    private List<JobProcessedDetailsDto> processedDetailList;
    private String sizeCategory;
    private String size;
    private LocalDateTime timeStamp;
    private User assignedBy;
    private User createdBy;
    private User designer;
    private User production;
    private User plateSetter;
    private String status;
}

package com.PrintLab.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class JobProcessedDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Double amount;
    private String vendor;
    private String payment;
    private boolean status;
    @Column(name = "is_job_processed")
    private boolean jobProcessed;
    private String processName;
    private LocalDateTime timeStamp;
    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "product_rule_job_id")
    @JsonIgnore
    @ToString.Exclude
    private ProductRuleJob productRuleJob;
}

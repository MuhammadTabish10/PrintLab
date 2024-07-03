package com.PrintLab.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import java.time.LocalDate;
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
    @Column(columnDefinition = "TEXT")
    private String description;
    private String payment;
    private boolean status;
    @Column(name = "is_job_processed")
    private boolean jobProcessed;
    private String processName;


    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime timeStamp;

    @CreationTimestamp
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dateAdded;

    private Boolean isPaid;


    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "product_rule_job_id")
    @JsonIgnore
    @ToString.Exclude
    private ProductRule productRule;


    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "order_id")
    private Order order;

    private Double balance;
}

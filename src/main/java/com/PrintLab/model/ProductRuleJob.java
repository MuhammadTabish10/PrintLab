package com.PrintLab.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.List;
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
public class ProductRuleJob {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String productName;
    private String sizeCategory;
    @Column(columnDefinition = "TEXT")
    private String size;
    private String category;
    @ManyToMany
    @JoinTable(
            name = "job_process",
            joinColumns = @JoinColumn(name = "product_rule_job_id"),
            inverseJoinColumns = @JoinColumn(name = "business_unit_process_id")
    )
    private List<BusinessUnitProcess> processList;
    @OneToMany(mappedBy = "productRuleJob", cascade = CascadeType.ALL)
    private List<JobProcessedDetails> processedDetailList;
    private String type;
}
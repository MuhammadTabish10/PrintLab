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
@Table(name = "product_rule")
public class ProductRule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String productName;
    private String printSide;
    private String jobColorFront;
    private String jobColorBack;
    @Column(columnDefinition = "TEXT")
    private String sizeCategory;
    @Column(columnDefinition = "TEXT")
    private String size;
    private String quantity;
    private Boolean impositionValue;
    private String status;

    @ManyToOne
    @JoinColumn(name = "press_machine_id")
    private PressMachine pressMachine;

    @ManyToOne
    @JoinColumn(name = "ctp_id")
    private Ctp ctp;

    @OneToMany(mappedBy = "productRule", cascade = CascadeType.ALL)
    private List<ProductRulePaperStock> productRulePaperStockList;

    private String businessCategory;
    @ManyToMany
    @JoinTable(
            name = "rule_process",
            joinColumns = @JoinColumn(name = "product_rule_id"),
            inverseJoinColumns = @JoinColumn(name = "business_unit_process_id")
    )
    private List<BusinessUnitProcess> processList;
    @OneToMany(mappedBy = "productRule", cascade = CascadeType.ALL)
    private List<JobProcessedDetails> processedDetailList;
    private String type;

    @ManyToMany
    @JoinTable(
            name = "list_of_role_visibleTo",
            joinColumns = @JoinColumn(name = "product_rule_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private List<Role> visibleTo;
    private Boolean groupSheet;
    private Boolean predefined;
    private Boolean custom;
    private Integer up;
    private Long groupSheetOf;
}



package com.PrintLab.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "product_rule_paper_stock")
public class ProductRulePaperStock {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String paperStock;
    private String customerFriendlyName;
    private String brand;
    private String madeIn;
    private String dimension;
    private String gsm;
    private Boolean status;

    @ManyToOne
    @JoinColumn(name = "vendor_id")
    private Vendor vendor;

    @ManyToOne
    @JoinColumn(name = "product_rule_id")
    private ProductRule productRule;
}

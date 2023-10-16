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
    private String title;

    @ManyToOne
    @JoinColumn(name = "press_machine_id")
    private PressMachine pressMachine;

    @ManyToOne
    @JoinColumn(name = "ctp_id")
    private Ctp ctp;

    @OneToMany(mappedBy = "productRule", cascade = CascadeType.ALL)
    private List<ProductRulePaperStock> productRulePaperStockList;
}

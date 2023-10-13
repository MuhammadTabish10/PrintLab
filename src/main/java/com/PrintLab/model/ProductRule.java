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
@Table(name = "product_rule")
public class ProductRule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String paperStock;
    private String brand;
    private String madeIn;
    private String dimension;
    private String gsm;
    private Boolean status;

    @ManyToOne
    @JoinColumn(name = "vendor_id")
    private Vendor vendor;

    @ManyToOne
    @JoinColumn(name = "press_machine_id")
    private PressMachine pressMachine;

    @ManyToOne
    @JoinColumn(name = "ctp_id")
    private Ctp ctp;
}

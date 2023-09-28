package com.PrintLab.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "new_product")
public class NewProduct {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String paperStock;
    private String size;
    private String quantity;
    private String printSide;
    private String jobColorFront;
    private String jobColorBack;
    private Boolean imposition;
    private Boolean isPaperStockPublic;
    private Boolean isSizePublic;
    private Boolean isQuantityPublic;
    private Boolean isPrintSidePublic;
    private Boolean isJobColorFrontPublic;
    private Boolean isJobColorBackPublic;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "newProduct")
    private List<ProductGsm> productGsm = new ArrayList<>();

    @JsonIgnore
    @OneToOne
    @JoinColumn(name = "product_definition_id")
    private ProductDefinition productDefinition;
}

package com.PrintLab.model;

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
@Table(name = "product_definition")
public class ProductDefinition {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private Boolean status;

    @ManyToOne
    @JoinColumn(name = "press_machine_id")
    private PressMachine pressMachine;

    @OneToMany(mappedBy = "productDefinition", cascade = CascadeType.ALL)
    private List<ProductDefinitionField> productDefinitionFieldList = new ArrayList<>();

    @OneToMany(mappedBy = "productDefinition", cascade = CascadeType.ALL)
    private List<ProductDefinitionProcess> productDefinitionProcessList = new ArrayList<>();
}

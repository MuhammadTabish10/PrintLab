package com.PrintLab.modal;

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
    private String status;


    @OneToMany(mappedBy = "productDefinition", cascade = CascadeType.ALL)
    private List<ProductDefinitionField> productDefinitionFieldList = new ArrayList<>();

}

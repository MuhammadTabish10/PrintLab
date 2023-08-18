package com.PrintLab.modal;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import javax.persistence.*;
import java.util.List;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "product_definition_field")
public class ProductDefinitionField {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long value;
    private Boolean isPublic;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_definition_id")
    private ProductDefinition productDefinition;

    @ManyToOne
    @JoinColumn(name = "product_field_id")
    private ProductField productField;

    @OneToMany(mappedBy = "productDefinitionField", cascade = CascadeType.ALL)
    private List<ProductDefinitionSelectedValues> selectedValues;
}

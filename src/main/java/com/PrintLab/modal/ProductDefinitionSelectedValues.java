package com.PrintLab.modal;

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
@Table(name = "product_definition_selected_values")
public class ProductDefinitionSelectedValues
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "product_definition_field_id")
    private ProductDefinitionField productDefinitionField;

    @ManyToOne
    @JoinColumn(name = "product_field_values_id")
    private ProductFieldValues productFieldValue;

    private String value;
}

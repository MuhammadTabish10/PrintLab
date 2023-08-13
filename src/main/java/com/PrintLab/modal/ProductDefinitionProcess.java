package com.PrintLab.modal;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity(name = "product_definition_process")
public class ProductDefinitionProcess
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "product_definition_id")
    private ProductDefinition productDefinition;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "product_process_id")
    private ProductProcess productProcess;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "vendor_id")
    private Vendor vendor;
}

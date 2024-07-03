package com.PrintLab.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import javax.persistence.*;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BusinessUnitProcess {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String process;
    private String type;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "vendor_business_unit_process",
            joinColumns = @JoinColumn(name = "business_unit_process_id"),
            inverseJoinColumns = @JoinColumn(name = "vendor_id")
    )
    @JsonIgnore
    @ToString.Exclude // Exclude from toString() to prevent recursion
    private List<Vendor> vendors;

    @ManyToOne
    @JoinColumn(name = "business_unit_category_id")
    @ToString.Exclude // Exclude from toString() to prevent recursion
    private BusinessUnitCategory category;

    @ManyToMany(mappedBy = "processList")
    @JsonIgnore
    @ToString.Exclude // Exclude from toString() to prevent recursion
    private List<ProductRule> productRuleList;
}


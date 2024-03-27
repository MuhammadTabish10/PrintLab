package com.PrintLab.model;

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
    private boolean billable;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "vendor_business_unit_process",
            joinColumns = @JoinColumn(name = "business_unit_process_id"),
            inverseJoinColumns = @JoinColumn(name = "vendor_id")
    )
    @ToString.Exclude
    private List<Vendor> vendors;


    @ManyToOne
    @JoinColumn(name = "business_unit_category_id")
    @ToString.Exclude
    private BusinessUnitCategory category;
}
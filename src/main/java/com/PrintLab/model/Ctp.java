package com.PrintLab.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import java.time.LocalDate;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "ctp")
public class Ctp {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @CreationTimestamp
    private LocalDate date;

    private Integer l1;
    private Integer l2;
    private String plateDimension;
    private Double rate;

    @ManyToOne()
    @JoinColumn(name = "vendor_id")
    private Vendor vendor;
}

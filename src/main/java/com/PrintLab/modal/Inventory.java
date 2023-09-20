package com.PrintLab.modal;

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
@Table(name = "inventory")
public class Inventory
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @CreationTimestamp
    private LocalDate created_at;

    private String paperStock;
    private String availableGsm;
    private String availableSizes;
    private Integer qty;
    private String madeIn;
    private String brandName;
    private String vendor;
    private LocalDate dateUpdated;
    private Double rate;
    private String status;
    private Double oldRate;
}

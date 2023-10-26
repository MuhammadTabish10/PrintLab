package com.PrintLab.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.List;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "uping")
public class Uping{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String productSize;
    private String category;
    private Double l1;
    private Double l2;
    private String unit;
    private String mm;
    private String inch;
    private Boolean status;

    @OneToMany(mappedBy = "uping", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<UpingPaperSize> upingPaperSize;
}

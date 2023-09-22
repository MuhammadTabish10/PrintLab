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
@Table(name = "press_machine")
public class PressMachine {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String plateDimension;
    private String gripperMargin;
    private String maxSheetSize;
    private String minSheetSize;
    private Integer maxSPH;
    private Double ctp_rate;
    private Double impression_1000_rate;
    private Boolean is_selected;
    private String status;

    @ManyToOne()
    @JoinColumn(name = "vendor_id")
    private Vendor vendor;

    @OneToMany(mappedBy = "pressMachine", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<PressMachineSize> pressMachineSize;
}
package com.PrintLab.modal;

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
    private Double ctp_rate;
    private Double impression_1000_rate;

    @OneToMany(mappedBy = "pressMachine", cascade = CascadeType.ALL)
    private List<PressMachineSize> pressMachineSize;
}

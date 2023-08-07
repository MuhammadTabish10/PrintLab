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
public class PressMachineSize
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "press_machine_id")
    private PressMachine pressMachine;

    @ManyToOne
    @JoinColumn(name = "paper_size_id")
    private PaperSize paperSize;

    private Integer value;
}

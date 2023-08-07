package com.PrintLab.modal;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
@Table(name = "paper_size")
public class PaperSize {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String label;
    private String status;

    @OneToMany(mappedBy = "paperSize", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<PressMachineSize> pressMachineSize;

    @OneToMany(mappedBy = "paperSize", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<UpingPaperSize> upingPaperSize;
}

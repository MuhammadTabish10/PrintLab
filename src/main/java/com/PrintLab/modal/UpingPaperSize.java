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
@Table(name = "uping_paper_size")
public class UpingPaperSize
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "uping_id")
    private Uping uping;

    @ManyToOne
    @JoinColumn(name = "paper_size_id")
    private PaperSize paperSize;

    private Integer value;
}

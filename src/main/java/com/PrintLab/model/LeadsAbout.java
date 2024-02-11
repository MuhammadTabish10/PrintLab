package com.PrintLab.model;

import lombok.*;

import javax.persistence.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeadsAbout {
    @Column(columnDefinition = "TEXT")
    private String description;
    private String source;
}

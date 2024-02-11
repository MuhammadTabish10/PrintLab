package com.PrintLab.model;

import lombok.*;

import javax.persistence.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Builder
public class LeadsContact {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String jobTitle;
    private String role;
    private String landLine;
    private String website;
    private String mobile;
    private String email;
    @ManyToOne
    @JoinColumn(name = "leads_id")
    @ToString.Exclude
    private Leads leads;
}

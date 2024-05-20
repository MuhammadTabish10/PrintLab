//package com.PrintLab.model;
//
//import lombok.AllArgsConstructor;
//import lombok.Builder;
//import lombok.Data;
//import lombok.NoArgsConstructor;
//
//import javax.persistence.*;
//
//@Builder
//@AllArgsConstructor
//@NoArgsConstructor
//@Data
//@Entity
//public class Proof {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//    @Lob
//    @Column(columnDefinition = "Text")
//    private String fileData;
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "production_job_id")
//    private ProductionJob productionJob;
//}

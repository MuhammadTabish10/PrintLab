//package com.PrintLab.model;
//
//import lombok.*;
//
//import javax.persistence.*;
//
//@Builder
//@Data
//@AllArgsConstructor
//@NoArgsConstructor
//@Entity
//public class JobSize {
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//    private String name;
//    @ManyToOne
//    @JoinColumn(name = "product_rule_job_id")
//    @ToString.Exclude
//    private ProductRuleJob productRuleJob;
//}
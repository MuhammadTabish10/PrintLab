//package com.PrintLab.controller;
//
//import com.PrintLab.dto.ProductionJobDto;
//import com.PrintLab.service.ProductionJobService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.access.prepost.PreAuthorize;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/production-jobs")
//public class ProductionJobController {
//    @Autowired
//    ProductionJobService productionJobService;
//
//    @GetMapping
//    public ResponseEntity<List<ProductionJobDto>> getAllProductionJobs() {
//        List<ProductionJobDto> productionJobs = productionJobService.getAllProductionJobs();
//        return ResponseEntity.ok(productionJobs);
//    }
//
//    @GetMapping("/{id}")
//    public ResponseEntity<ProductionJobDto> getProductionJobById(@PathVariable Long id) {
//        ProductionJobDto productionJob = productionJobService.getProductionJobById(id);
//        return ResponseEntity.ok(productionJob);
//    }
//
//    @PostMapping
//    public ResponseEntity<ProductionJobDto> createProductionJob
//            (
//                    @RequestBody ProductionJobDto productionJobDto,
//                    @RequestParam Long loggedInUserId
//            ) {
//        ProductionJobDto createdProductionJob = productionJobService.createProductionJob(productionJobDto, loggedInUserId);
//        return new ResponseEntity<>(createdProductionJob, HttpStatus.CREATED);
//    }
//
//    @PutMapping("/{id}")
//    public ResponseEntity<ProductionJobDto> updateProductionJob(@PathVariable Long id, @RequestBody ProductionJobDto productionJobDto) {
//        ProductionJobDto updatedProductionJob = productionJobService.updateProductionJob(id, productionJobDto);
//        return ResponseEntity.ok(updatedProductionJob);
//    }
//
//    @DeleteMapping("/{id}")
//    public ResponseEntity<Void> deleteProductionJob(@PathVariable Long id) {
//        productionJobService.deleteProductionJob(id);
//        return ResponseEntity.noContent().build();
//    }
//
//    @PostMapping("/assignUser")
//    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_CUSTOMER_SUPPORT')")
//    public ResponseEntity<ProductionJobDto> assignUserToOrder(
//            @RequestParam Long orderId,
//            @RequestParam Long userId,
//            @RequestParam String role,
//            @RequestParam Long loggedInUser
//    ) {
//
//        ProductionJobDto assignedUser = productionJobService.assignOrderToUser(orderId, userId, role, loggedInUser);
//        return ResponseEntity.ok(assignedUser);
//    }
//
//}

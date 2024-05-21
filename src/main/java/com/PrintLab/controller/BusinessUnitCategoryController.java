package com.PrintLab.controller;

import com.PrintLab.dto.BusinessUnitCategoryDto;
import com.PrintLab.service.BusinessUnitCategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/business-unit-categories")
public class BusinessUnitCategoryController {
    @Autowired
    BusinessUnitCategoryService categoryService;

    @PostMapping
    public ResponseEntity<?> createCategory(@RequestBody BusinessUnitCategoryDto categoryDto) {
        try {
            BusinessUnitCategoryDto createdCategory = categoryService.createCategory(categoryDto);
            return new ResponseEntity<>(createdCategory, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new Object() {
                        public final String error = "A similar category already exists.";
                    });
        }

    }


    @GetMapping
    public ResponseEntity<List<BusinessUnitCategoryDto>> getAllCategories() {
        List<BusinessUnitCategoryDto> categories = categoryService.getAllCategories();
        return new ResponseEntity<>(categories, HttpStatus.OK);
    }

    @GetMapping("/{categoryId}")
    public ResponseEntity<BusinessUnitCategoryDto> getCategoryById(@PathVariable Long categoryId) {
        BusinessUnitCategoryDto category = categoryService.getCategoryById(categoryId);
        return new ResponseEntity<>(category, HttpStatus.OK);
    }

    @GetMapping("/check/{name}")
    public ResponseEntity<Boolean> checkTitle(@PathVariable String name) {
        return ResponseEntity.ok(categoryService.getCategoryByName(name));
    }

    // UPDATE
    @PutMapping("/{categoryId}")
    public ResponseEntity<BusinessUnitCategoryDto> updateCategory(@PathVariable Long categoryId, @RequestBody BusinessUnitCategoryDto categoryDto) {
        BusinessUnitCategoryDto updatedCategory = categoryService.updateCategory(categoryId, categoryDto);
        return ResponseEntity.ok(updatedCategory);
    }

    @PutMapping("/updateProcessReorder/{categoryId}")
    public ResponseEntity<BusinessUnitCategoryDto> updateProcessOrder(@PathVariable Long categoryId, @RequestBody BusinessUnitCategoryDto categoryDto) {
        BusinessUnitCategoryDto updatedProcessOrder = categoryService.updateProcessReorder(categoryId, categoryDto);
        return ResponseEntity.ok(updatedProcessOrder);
    }

    // DELETE
    @DeleteMapping("/process/{processId}")
    public ResponseEntity<String> deleteProcess(@PathVariable Long processId) {
        String message = categoryService.deleteProcess(processId);
        return ResponseEntity.ok().body(message);
    }

    @DeleteMapping("/{categoryId}")
    public ResponseEntity<String> deleteCategory(@PathVariable Long categoryId) {
        String message = categoryService.deleteCategory(categoryId);
        return ResponseEntity.ok().body(message);
    }

    @GetMapping("/categories/{name}")
    public ResponseEntity<List<BusinessUnitCategoryDto>> getAllByName(@PathVariable String name) {
        return ResponseEntity.ok(categoryService.getAllByName(name));
    }

}

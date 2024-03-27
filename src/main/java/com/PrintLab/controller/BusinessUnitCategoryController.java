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
        return new ResponseEntity<>(updatedCategory, HttpStatus.OK);
    }

    // DELETE
    @DeleteMapping("/process/{categoryId}")
    public ResponseEntity<Void> deleteProcess(@PathVariable Long categoryId) {
        categoryService.deleteProcess(categoryId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @DeleteMapping("/{categoryId}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long categoryId) {
        categoryService.deleteCategory(categoryId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/categories/{name}")
    public ResponseEntity<List<BusinessUnitCategoryDto>> getAllByName(@PathVariable String name) {
        return ResponseEntity.ok(categoryService.getAllByName(name));
    }

}

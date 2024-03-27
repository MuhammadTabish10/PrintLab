package com.PrintLab.GenericController;

import com.PrintLab.model.Business;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

public abstract class GenericController<T, ID> {

    @Autowired
    private JpaRepository<T, ID> repository;

    @GetMapping
    public ResponseEntity<List<T>> getAllEntities() {
        List<T> entities = repository.findAll();
        return ResponseEntity.ok(entities);
    }

    @GetMapping("/{id}")
    public ResponseEntity<T> getEntityById(@PathVariable ID id) {
        Optional<T> entity = repository.findById(id);
        return entity.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<T> createEntity(@RequestBody T entity) {
        T createdEntity = repository.save(entity);
        return new ResponseEntity<>(createdEntity, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<T> updateEntity(@PathVariable ID id, @RequestBody T entity) {
        if (repository.existsById(id)) {
            T updatedEntity = repository.save(entity);
            return ResponseEntity.ok(updatedEntity);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEntity(@PathVariable ID id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    protected abstract JpaRepository<Business, Long> getRepository();
}

package com.PrintLab.repository;

import com.PrintLab.model.BindingLabour;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface BindingLabourRepository extends JpaRepository<BindingLabour, Long> {

//    Optional<BindingLabour> findByIdAndStatusIsTrue(Long id);
    List<BindingLabour> findByStatus(boolean status);

    List<BindingLabour> findLabourByNameLike(String name);

}

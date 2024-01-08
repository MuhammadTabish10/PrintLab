package com.PrintLab.service;

import com.PrintLab.dto.BindingLabourDto;
import com.PrintLab.model.BindingLabour;

import java.util.List;

public interface BindingLabourService {
    BindingLabourDto save(BindingLabourDto bindingLabourDto);

    List<BindingLabourDto> findAll();

    BindingLabourDto findById(Long id);

    List<BindingLabourDto> searchByName(String name);

    void deleteById(Long id);

    BindingLabourDto updateLabour(Long id, BindingLabour bindingLabour);
}

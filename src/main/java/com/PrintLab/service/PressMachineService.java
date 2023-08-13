package com.PrintLab.service;

import com.PrintLab.dto.PressMachineDto;
import com.PrintLab.modal.PressMachine;
import com.PrintLab.modal.PressMachineSize;
import com.PrintLab.modal.ProductFieldValues;

import java.util.List;

public interface PressMachineService
{
    PressMachineDto save(PressMachineDto pressMachineDto);
    List<PressMachineDto> getAll();
    PressMachineDto findById(Long id);
    String deleteById(Long id);
    PressMachineDto updatePressMachine(Long id, PressMachineDto pressMachineDto);
    void deletePressMachineSizeById(Long id, Long pressMachineSizeId);
}

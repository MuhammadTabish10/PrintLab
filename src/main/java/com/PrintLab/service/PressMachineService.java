package com.PrintLab.service;

import com.PrintLab.dto.PaperSizeDto;
import com.PrintLab.dto.PressMachineDto;

import java.util.List;

public interface PressMachineService
{
    PressMachineDto save(PressMachineDto pressMachineDto);
    List<PressMachineDto> getAll();
    PressMachineDto findById(Long id);
    PressMachineDto findByName(String name);

    List<PressMachineDto> getPressMachineByPaperSizeId(Long paperSizeId);
    String deleteById(Long id);
    PressMachineDto updatePressMachine(Long id, PressMachineDto pressMachineDto);
    void deletePressMachineSizeById(Long id, Long pressMachineSizeId);
}

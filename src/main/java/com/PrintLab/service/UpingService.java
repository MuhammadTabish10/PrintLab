package com.PrintLab.service;

import com.PrintLab.dto.UpingDto;
import com.PrintLab.modal.Uping;
import com.PrintLab.modal.UpingPaperSize;

import java.util.List;

public interface UpingService
{
    UpingDto save(UpingDto upingDto);
    List<UpingDto> getAll();
    UpingDto findById(Long id) throws Exception;
    String deleteById(Long id);
    UpingDto updateUping(Long id, Uping uping);
}

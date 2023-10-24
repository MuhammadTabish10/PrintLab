package com.PrintLab.service;

import com.PrintLab.dto.PaginationResponse;
import com.PrintLab.dto.UpingDto;

import java.util.List;

public interface UpingService
{
    UpingDto save(UpingDto upingDto);
    List<UpingDto> getAll();
    PaginationResponse getAllPaginatedUping(Integer pageNumber, Integer pageSize);

    UpingDto findById(Long id);
    UpingDto findByProductSize(String productSize);
    List<UpingDto> searchByProductSize(String productSize);
    List<UpingDto> getUpingByPaperSizeId(Long paperSizeId);
    String deleteById(Long id);
    UpingDto updateUping(Long id, UpingDto upingDto);
    void deleteUpingPaperSizeById(Long id, Long upingPaperSizeId);
}

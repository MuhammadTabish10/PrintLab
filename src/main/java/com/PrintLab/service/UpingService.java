package com.PrintLab.service;

import com.PrintLab.dto.PaginationResponse;
import com.PrintLab.dto.UpingDto;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface UpingService
{
    UpingDto save(UpingDto upingDto);
    List<UpingDto> getAll();
    PaginationResponse getAllPaginatedUping(Integer pageNumber, Integer pageSize);

    UpingDto findById(Long id);
    UpingDto findByProductSize(String productSize);
    PaginationResponse searchByProductSize(String productSize, Integer pageNumber, Integer pageSize);
    List<UpingDto> getUpingByPaperSizeId(Long paperSizeId);
    String deleteById(Long id);
    UpingDto updateUping(Long id, UpingDto upingDto);
    void deleteUpingPaperSizeById(Long id, Long upingPaperSizeId);
    List<UpingDto> uploadFile(MultipartFile multipartFile);

    List<UpingDto> findByCategory(String category);
}
